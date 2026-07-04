const UTC_06_OFFSET_MS = 6 * 60 * 60 * 1000;

const pad = (value: number, length = 2) => String(value).padStart(length, '0');

/**
 * Fecha para columnas TIMESTAMP sin zona horaria guardadas como hora local UTC-06.
 */
export const nowUtcMinus6 = () => new Date(Date.now() - UTC_06_OFFSET_MS);

/**
 * Formatea timestamps locales UTC-06 sin volver a convertirlos a UTC.
 */
export const formatUtcMinus6Timestamp = (value?: Date) => {
  if (!value) return undefined;

  return [
    `${value.getUTCFullYear()}-${pad(value.getUTCMonth() + 1)}-${pad(value.getUTCDate())}`,
    `T${pad(value.getUTCHours())}:${pad(value.getUTCMinutes())}:${pad(value.getUTCSeconds())}`,
    `.${pad(value.getUTCMilliseconds(), 3)}-06:00`
  ].join('');
};
