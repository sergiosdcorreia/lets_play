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

  type FormInputProps = {
    name: string;
    label: string;
    placeholder: string;
    type?: string;
    register: UseFormRegister;
    error?: FieldError;
    validation?: RegisterOptions;
    disabled?: boolean;
    value?: string;
  };
}

export {};
