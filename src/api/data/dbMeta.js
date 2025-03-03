import { useState, useEffect } from "react";
import { api } from "../instance";

const useGetDbMeta = () => {
  const [meta, setMeta] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recall, setRecall] = useState(1);
  const refetch = () => {
    console.log("refetching");
    setRecall(recall * -1);
  };

  useEffect(() => {
    const fetchFolders = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/folders/get-db-meta`);
        console.log(response.data, "from hook");
        setMeta(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFolders();
  }, [recall]);

  return { meta, loading, error, refetch };
};

export default useGetDbMeta;
