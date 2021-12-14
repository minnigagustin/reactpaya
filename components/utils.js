export const getDeliveryFee = (custom_fields) => {
  return custom_fields.find((field) => field.label === "Delivery_Fee")?.data;
};
