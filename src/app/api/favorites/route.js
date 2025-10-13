import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { collectionNamesObj, dbConnect } from '@/lib/dbconnect';
import { ObjectId } from 'mongodb';

// GET - Get user's favorite restaurants
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const favoritesCollection = await dbConnect(collectionNamesObj.favoriteRestaurantsCollection);
    const userCollection = await dbConnect(collectionNamesObj.userCollection);
    const restaurantCollection = await dbConnect(collectionNamesObj.restaurantCollection);

    const user = await userCollection.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's favorites with restaurant details
    const favorites = await favoritesCollection
      .aggregate([
        { 
          $match: { 
            userId: user._id 
          } 
        },
        {
          $lookup: {
            from: 'restaurants',
            localField: 'restaurantId',
            foreignField: '_id',
            as: 'restaurant'
          }
        },
        {
          $unwind: '$restaurant'
        },
        {
          $project: {
            _id: 1,
            restaurantId: '$restaurant._id',
            name: '$restaurant.name',
            cuisineType: '$restaurant.cuisineType',
            image: '$restaurant.image',
            rating: '$restaurant.rating',
            deliveryTime: '$restaurant.deliveryTime',
            deliveryFee: '$restaurant.deliveryFee',
            minimumOrder: '$restaurant.minimumOrder',
            addedAt: 1
          }
        },
        {
          $sort: { addedAt: -1 }
        }
      ])
      .toArray();

    const serializedFavorites = favorites.map(fav => ({
      ...fav,
      _id: fav._id.toString(),
      restaurantId: fav.restaurantId.toString(),
    }));

    return NextResponse.json({
      success: true,
      data: serializedFavorites,
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { success: false, message: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}

// POST - Add restaurant to favorites
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { restaurantId } = await req.json();

    if (!restaurantId) {
      return NextResponse.json(
        { success: false, message: 'Restaurant ID is required' },
        { status: 400 }
      );
    }

    const favoritesCollection = await dbConnect(collectionNamesObj.favoriteRestaurantsCollection);
    const userCollection = await dbConnect(collectionNamesObj.userCollection);
    const restaurantCollection = await dbConnect(collectionNamesObj.restaurantCollection);

    const user = await userCollection.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if restaurant exists
    let restaurantObjectId;
    try {
      restaurantObjectId = new ObjectId(restaurantId);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid restaurant ID' },
        { status: 400 }
      );
    }

    const restaurant = await restaurantCollection.findOne({
      _id: restaurantObjectId,
    });

    if (!restaurant) {
      return NextResponse.json(
        { success: false, message: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Check if already favorited
    const existingFavorite = await favoritesCollection.findOne({
      userId: user._id,
      restaurantId: restaurantObjectId,
    });

    if (existingFavorite) {
      return NextResponse.json(
        { success: false, message: 'Restaurant already in favorites' },
        { status: 400 }
      );
    }

    // Add to favorites
    const result = await favoritesCollection.insertOne({
      userId: user._id,
      restaurantId: restaurantObjectId,
      addedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'Restaurant added to favorites',
      data: { id: result.insertedId.toString() },
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { success: false, message: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}

// DELETE - Remove restaurant from favorites
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { restaurantId } = await req.json();

    if (!restaurantId) {
      return NextResponse.json(
        { success: false, message: 'Restaurant ID is required' },
        { status: 400 }
      );
    }

    const favoritesCollection = await dbConnect(collectionNamesObj.favoriteRestaurantsCollection);
    const userCollection = await dbConnect(collectionNamesObj.userCollection);

    const user = await userCollection.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    let restaurantObjectId;
    try {
      restaurantObjectId = new ObjectId(restaurantId);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid restaurant ID' },
        { status: 400 }
      );
    }

    // Remove from favorites
    const result = await favoritesCollection.deleteOne({
      userId: user._id,
      restaurantId: restaurantObjectId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Favorite not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Restaurant removed from favorites',
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { success: false, message: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}