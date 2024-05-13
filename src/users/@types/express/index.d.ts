type AppRequest = Request & {
  currentUser?: Partial<User>;
  session: {
    userId?: number;
  };
};

export default AppRequest;
