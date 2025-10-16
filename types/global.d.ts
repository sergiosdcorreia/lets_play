declare global {
  interface SignInFormData {
    email: string;
    password: string;
  }

  type SignUpFormData = {
    fullName: string;
    email: string;
    password: string;
  };
}

export {};
