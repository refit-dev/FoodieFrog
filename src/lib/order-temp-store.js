import { collectionNamesObj, dbConnect } from '@/lib/dbconnect';

// Use your existing orders collection for temporary storage with a flag
export async function storeTempOrder(paymentIntentId, orderData) {
  const tempOrdersCollection = await dbConnect(collectionNamesObj.orderCollection);
  
  await tempOrdersCollection.insertOne({
    _id: paymentIntentId, // Use paymentIntentId as _id for easy lookup
    orderData: orderData,
    isTemp: true, // Flag to identify temporary orders
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiry
  });
}

export async function getTempOrder(paymentIntentId) {
  const tempOrdersCollection = await dbConnect(collectionNamesObj.orderCollection);
  
  const tempOrder = await tempOrdersCollection.findOne({
    _id: paymentIntentId,
    isTemp: true,
    expiresAt: { $gt: new Date() } // Only return if not expired
  });
  
  return tempOrder ? tempOrder.orderData : null;
}

export async function deleteTempOrder(paymentIntentId) {
  const tempOrdersCollection = await dbConnect(collectionNamesObj.orderCollection);
  
  await tempOrdersCollection.deleteOne({ 
    _id: paymentIntentId, 
    isTemp: true 
  });
}

// Optional: Cleanup expired temp orders
export async function cleanupExpiredTempOrders() {
  const tempOrdersCollection = await dbConnect(collectionNamesObj.orderCollection);
  
  await tempOrdersCollection.deleteMany({
    isTemp: true,
    expiresAt: { $lt: new Date() }
  });
}