import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { collectionNamesObj, dbConnect } from '@/lib/dbconnect';

// GET - Fetch user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userCollection = await dbConnect(collectionNamesObj.userCollection);

    // Get user from database
    const user = await userCollection.findOne({ 
      email: session.user.email 
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Remove sensitive information
    const { password, ...userData } = user;

    return NextResponse.json({
      success: true,
      data: {
        ...userData,
        _id: userData._id.toString()
      }
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await req.json();
    const { name, phone, address, preferences } = payload;

    const userCollection = await dbConnect(collectionNamesObj.userCollection);

    // Update user profile
    const result = await userCollection.updateOne(
      { email: session.user.email },
      { 
        $set: { 
          name: name,
          phone: phone,
          address: address,
          preferences: preferences,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}