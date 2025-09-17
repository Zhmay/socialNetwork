export const commentValidationSchema = {
  name: [
    { rule: 'required', message: 'Name is required' },
    { rule: 'minLength', value: 3, message: 'Name must be at least 3 characters' },
    { rule: 'maxLength', value: 16, message: 'Name must be less than 16 characters' },
  ],
  email: [
    { rule: 'required', message: 'Email is required' },
    { rule: 'email', message: 'Please enter a valid email address' },
  ],
  comment: [
    { rule: 'required', message: 'Comment message is required' },
    { rule: 'minLength', value: 20, message: 'Comment must be at least 20 characters' },
    { rule: 'maxLength', value: 2000, message: 'Comment must be less than 2000 characters' },
  ],
}
