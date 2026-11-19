import ResponseUtil from '../response.util.js';

export const validateUsingZOD = (schema, source = 'body') => (req, res, next) => {
  const dataToValidate = req[source];
  const result = schema.safeParse(dataToValidate);

  if (!result.success) {
    const friendlyErrors = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    return res.status(400).json(ResponseUtil.validationError('Validation error', friendlyErrors));
  }

  req[source] = result.data;
  next();
};

export default validateUsingZOD;
