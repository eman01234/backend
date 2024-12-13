// rolesPermissions.js
const rolesPermissions = {
  Admin: {
    resources: {
      carts: ["READ", "WRITE", "DELETE"],
      categories: ["READ", "WRITE", "DELETE"],
      chats: ["READ", "WRITE", "DELETE"],
      customers: ["READ", "WRITE", "DELETE"],
      deliverypeople: ["READ", "WRITE", "DELETE"],
      managers: ["READ", "WRITE", "DELETE"],
      merchants: ["READ", "WRITE", "DELETE"],
      messages: ["READ", "WRITE", "DELETE"],
      orders: ["READ", "WRITE", "DELETE"],
      payments: ["READ", "WRITE", "DELETE"],
      productreviews: ["READ", "WRITE", "DELETE"],
      products: ["READ", "WRITE", "DELETE"],
      users: ["READ", "WRITE", "DELETE"],
    },
  },
  Manager: {
    resources: {
      merchants: ["READ", "WRITE", "DELETE"],
      deliverypeople: ["READ", "WRITE", "DELETE"],
      products: ["READ", "WRITE", "DELETE"],
      chats: ["READ", "WRITE", "DELETE"],
      categories: ["READ", "WRITE", "DELETE"],
      orders: ["READ", "WRITE"],
      customers: ["READ", "WRITE", "DELETE"],
      categories: ["READ", "WRITE", "DELETE"],
      productreviews: ["READ", "WRITE", "DELETE"],
      users: ["READ", "WRITE", "DELETE"],
    },
  },
  merchant: {
    resources: {
      products: ["READ", "WRITE", "DELETE"],
      productreviews: ["READ"],
      categories: ["READ"],
      orders: ["READ"],
      customers: ["READ"],
      payments: ["READ", "WRITE"],
      users: ["READ", "WRITE", "DELETE"],
    },
  },
  DeliveryPerson: {
    resources: {
      orders: ["READ", "WRITE"],
      customers: ["READ"],
      users: ["READ", "WRITE", "DELETE"],
    },
  },
  Customer: {
    resources: {
      products: ["READ"],
      carts: ["READ", "WRITE", "DELETE"],
      payments: ["READ", "WRITE"],
      chats: ["READ", "WRITE", "DELETE"],
      orders: ["READ", "WRITE", "DELETE"],
      productreviews: ["READ", "WRITE"],
      users: ["READ", "WRITE", "DELETE"],
    },
  },
};

export default rolesPermissions;
