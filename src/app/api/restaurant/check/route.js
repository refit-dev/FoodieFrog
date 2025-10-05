import { authOptions } from "@/lib/authOptions";
import { collectionNamesObj, dbConnect } from "@/lib/dbconnect";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return Response.json({ isRestaurant: false });
  }

  const restaurantCollection = await dbConnect(collectionNamesObj.restaurantCollection);
  const restaurant = await restaurantCollection.findOne({ 
    ownerEmail: session.user.email 
  });

  return Response.json({ 
    isRestaurant: !!restaurant,
    restaurantId: restaurant?._id 
  });
}