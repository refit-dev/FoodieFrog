// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'Please provide a name'],
//     maxlength: [50, 'Name cannot be more than 50 characters'],
//   },
//   email: {
//     type: String,
//     required: [true, 'Please provide an email'],
//     unique: true,
//     lowercase: true,
//   },
//   password: {
//     type: String,
//     required: [true, 'Please provide a password'],
//     minlength: [6, 'Password must be at least 6 characters'],
//   },
//   role: {
//     type: String,
//     enum: ['customer', 'restaurant_owner', 'admin'],
//     default: 'customer',
//   },
//   phone: {
//     type: String,
//     required: [true, 'Please provide a phone number'],
//   },
//   address: {
//     street: String,
//     city: String,
//     state: String,
//     zipCode: String,
//   },
//   avatar: {
//     type: String,
//     default: '',
//   },
//   isVerified: {
//     type: Boolean,
//     default: false,
//   },
//   favorites: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Restaurant',
//   }],
// }, {
//   timestamps: true,
// });

// // Remove password when returning user as JSON
// userSchema.methods.toJSON = function() {
//   const user = this.toObject();
//   delete user.password;
//   return user;
// };

// export default mongoose.models.User || mongoose.model('User', userSchema);







import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [50, 'Name cannot be more than 50 characters'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  role: {
    type: String,
    enum: ['customer', 'restaurant', 'admin'], // Changed 'restaurant_owner' to 'restaurant' to match our code
    default: 'customer',
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please provide a valid phone number']
  },
  address: {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    },
    country: { // Added country field
      type: String,
      default: 'USA',
      trim: true
    }
  },
  avatar: {
    type: String,
    default: '',
  },
  preferences: { // Added preferences object
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: true
    },
    marketingEmails: {
      type: Boolean,
      default: false
    }
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
  }],
  // For social login users
  provider: {
    type: String,
    enum: ['google', 'credentials'],
    default: 'credentials'
  },
  providerAccountId: {
    type: String,
    sparse: true // Allows null for credential-based users
  }
}, {
  timestamps: true,
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'favorites': 1 });

// Remove password when returning user as JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Virtual for full address
userSchema.virtual('fullAddress').get(function() {
  if (!this.address.street) return 'No address set';
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}, ${this.address.country}`;
});

export default mongoose.models.User || mongoose.model('User', userSchema);