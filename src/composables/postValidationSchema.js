export const postValidationSchema = {
  title: [
    { rule: 'required', message: 'Title is required' },
    { rule: 'minLength', value: 12, message: 'Title must be at least 12 characters' },
    { rule: 'maxLength', value: 60, message: 'Title must be less than 60 characters' },
  ],
  body: [
    { rule: 'required', message: 'Comment message is required' },
    { rule: 'minLength', value: 20, message: 'Comment must be at least 20 characters' },
    { rule: 'maxLength', value: 2000, message: 'Comment must be less than 2000 characters' },
  ],
}
