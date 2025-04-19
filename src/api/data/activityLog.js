import { useFetchData } from "../instance";

const useActivityLog = () => {
  const {
    data: logs,
    error: errorInFetchingLogs,
    isLoading: loadingLogs,
    refetch: refetchLogs,
  } = useFetchData({
    queryKey: ["logs"],
    url: `/logs`,
  });

  return {
    logs: logs?.data,
    errorInFetchingLogs,
    loadingLogs,
    refetchLogs,
  };
};

export default useActivityLog;
