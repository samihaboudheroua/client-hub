import { useQueryClient } from "@tanstack/react-query";
import { 
  useListRequests as useGeneratedListRequests,
  useGetRequest as useGeneratedGetRequest,
  useCreateRequest as useGeneratedCreateRequest,
  useUpdateRequest as useGeneratedUpdateRequest,
  useListRequestFiles as useGeneratedListRequestFiles,
  useUploadRequestFile as useGeneratedUploadRequestFile,
  useListRequestComments as useGeneratedListRequestComments,
  useAddRequestComment as useGeneratedAddRequestComment,
  type ListRequestsParams
} from "@workspace/api-client-react";

export function useRequests(params?: ListRequestsParams) {
  return useGeneratedListRequests(params);
}

export function useRequest(id: number) {
  return useGeneratedGetRequest(id, { query: { enabled: !!id } });
}

export function useCreateRequest() {
  const queryClient = useQueryClient();
  return useGeneratedCreateRequest({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
      }
    }
  });
}

export function useUpdateRequest() {
  const queryClient = useQueryClient();
  return useGeneratedUpdateRequest({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
        if (data.id) {
          queryClient.invalidateQueries({ queryKey: [`/api/requests/${data.id}`] });
        }
      }
    }
  });
}

export function useRequestFiles(id: number) {
  return useGeneratedListRequestFiles(id, { query: { enabled: !!id } });
}

export function useUploadFile() {
  const queryClient = useQueryClient();
  return useGeneratedUploadRequestFile({
    mutation: {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: [`/api/requests/${variables.id}/files`] });
        queryClient.invalidateQueries({ queryKey: [`/api/requests/${variables.id}`] });
      }
    }
  });
}

export function useRequestComments(id: number) {
  return useGeneratedListRequestComments(id, { query: { enabled: !!id } });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  return useGeneratedAddRequestComment({
    mutation: {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: [`/api/requests/${variables.id}/comments`] });
        queryClient.invalidateQueries({ queryKey: [`/api/requests/${variables.id}`] });
      }
    }
  });
}
