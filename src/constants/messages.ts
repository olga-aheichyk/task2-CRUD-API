export enum Message {
	JsonParsingError = 'Invalid JSON',
	SmthWentWrongError = 'Something went wrong',
	NotFoundError = 'Route not found',
	UserValidationError = 'Invalid user data',
	WrongUserIdError = 'Wrong user id, not UUID',
	UserNotFoundError = 'User with such id is not found',
	UserAddedSuccessfully = 'New user has been added',
	UserDeletedSuccesfully = 'User has been deleted successfully',
	UserUpdatedSuccesfully = 'User has been updated successfully'
};