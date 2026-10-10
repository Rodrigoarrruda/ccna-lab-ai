export type MysqlFailureDetails = {
  code: string;
  errno?: number;
  sqlState?: string;
};

function sourceOf(error: unknown): Record<string, unknown> {
  return typeof error === 'object' && error !== null ? error as Record<string, unknown> : {};
}

export function mysqlFailureDetails(error: unknown): MysqlFailureDetails {
  const source = sourceOf(error);
  const rawCode = source.code;
  const rawErrno = source.errno;
  const rawSqlState = source.sqlState;
  const code = typeof rawCode === 'string' && /^[A-Z0-9_]{1,64}$/.test(rawCode)
    ? rawCode
    : 'UNKNOWN';
  const errno = typeof rawErrno === 'number' && Number.isInteger(rawErrno) && rawErrno >= 0 && rawErrno <= 99999
    ? rawErrno
    : undefined;
  const sqlState = typeof rawSqlState === 'string' && /^[A-Z0-9]{5}$/.test(rawSqlState)
    ? rawSqlState
    : undefined;
  return {code, errno, sqlState};
}

export function logMysqlFailure(
  route: string,
  stage: string,
  requestId: string,
  error: unknown,
): void {
  const details = mysqlFailureDetails(error);
  console.error(
    `[mysql] route=${route} stage=${stage} request_id=${requestId} code=${details.code} errno=${details.errno ?? 'none'} sql_state=${details.sqlState ?? 'none'}`,
  );
}
