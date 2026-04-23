import { useQueryClient } from "@tanstack/react-query";
import { 
  useListProjects as useGeneratedListProjects,
  useGetProject as useGeneratedGetProject,
  useCreateProject as useGeneratedCreateProject,
  useUpdateProject as useGeneratedUpdateProject
} from "@workspace/api-client-react";

export function useProjects() {
  return useGeneratedListProjects();
}

export function useProject(id: number) {
  return useGeneratedGetProject(id, { query: { enabled: !!id } });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useGeneratedCreateProject({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      }
    }
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useGeneratedUpdateProject({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
        if (data.id) {
          queryClient.invalidateQueries({ queryKey: [`/api/projects/${data.id}`] });
        }
      }
    }
  });
}
