import { NextResponse } from 'next/server';
import { collectionNamesObj, dbConnect } from '@/lib/dbconnect';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

// GET all reviews for a restaurant
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const reviewsCollection = await dbConnect(collectionNamesObj.reviewsCollection);
    const reviews = await reviewsCollection
      .find({ restaurantId: new ObjectId(id) })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: reviews
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

// POST a new review
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const payload = await request.json();

    // Validate required fields
    if (!payload.rating || !payload.comment) {
      return NextResponse.json(
        { success: false, message: 'Rating and comment are required' },
        { status: 400 }
      );
    }

    const reviewsCollection = await dbConnect(collectionNamesObj.reviewsCollection);
    const restaurantCollection = await dbConnect(collectionNamesObj.restaurantCollection);

    // Check if user already reviewed this restaurant
    const existingReview = await reviewsCollection.findOne({
      restaurantId: new ObjectId(id),
      userId: new ObjectId(session.user.id)
    });

    if (existingReview) {
      return NextResponse.json(
        { success: false, message: 'You have already reviewed this restaurant' },
        { status: 400 }
      );
    }

    // Create new review
    const review = {
      restaurantId: new ObjectId(id),
      userId: new ObjectId(session.user.id),
      userName: session.user.name,
      userEmail: session.user.email,
      rating: parseInt(payload.rating),
      comment: payload.comment,
      title: payload.title || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await reviewsCollection.insertOne(review);

    // Calculate new average rating for the restaurant
    const allReviews = await reviewsCollection
      .find({ restaurantId: new ObjectId(id) })
      .toArray();

    const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
    const averageRating = (totalRating / allReviews.length).toFixed(1);

    // Update restaurant with new average rating
    await restaurantCollection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          rating: parseFloat(averageRating),
          updatedAt: new Date()
        } 
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully',
      data: { id: result.insertedId }
    });

  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}