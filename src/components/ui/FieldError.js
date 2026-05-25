export const FieldError = ({ msg }) => msg ? (
  <p className="field-error">⚠ {msg}</p>
) : null;
