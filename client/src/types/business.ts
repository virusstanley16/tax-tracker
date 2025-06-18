export interface Business {
  _id: string;
  name: string;
  ownerName: string;
  email: string;
  address: string;
  phone: string;
  businessType: string;
  status: 'active' | 'inactive' | 'suspended';
  userAccount: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessFormValues {
  name: string;
  ownerName: string;
  email: string;
  address: string;
  phone: string;
  businessType: string;
  userId: string;
  status: 'active' | 'inactive' | 'suspended';
} 