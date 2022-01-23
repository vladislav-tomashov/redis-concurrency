const getCustomerId = (params: { customerId: string }): string => {
  return params.customerId;
};

const getCustomerConcurrency = (customerId: string): number => {
  if (customerId) {
    return 5;
  }

  return 1;
};

export { getCustomerId, getCustomerConcurrency };
