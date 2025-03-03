export async function call(apiCall, data, onSuccess, onError) {
  try {
    const response = await apiCall(data);
    if (onSuccess) onSuccess(response);
    return response;
  } catch (error) {
    if (onError) onError(error);
    else console.error(error, "api call:", apiCall.name, " failed");
    return error;
  }
}
