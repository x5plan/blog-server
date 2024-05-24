// Attention!
// Do NOT modify the existing code.
export const enum CE_ErrorCode {
    Unknown = -1,

    // Native HTTP Code
    AuthRequired = 401,
    PermissionDenied = 403,
    NotFound = 404,
    TooManyRequests = 429,
    ServerError = 500,

    // Global Error Code (1000 ~ 1199)
    ValidationError = 1000,
    RecaptchaError = 1001,
    MailSendError = 1002,

    // Auth Module Error Code (1200 ~ 1299)
    Auth_NoSuchUser = 1200,
    Auth_WrongPassword = 1201,
    Auth_DuplicateUsername = 1202,
    Auth_DuplicateEmail = 1203,
    Auth_InvalidEmailVerificationCode = 1204,
    Auth_InvalidRegistrationCode = 1205,
    Auth_EmailVerificationCodeRateLimited = 1206,
    Auth_RegistrationCodeAlreadyUsed = 1207,
    Auth_RegistrationCodeLimitExceeded = 1208,

    // User Module Error Code (1300 ~ 1399)
    User_NoSuchUser = 1300,
    User_DuplicateUsername = 1301,
}
