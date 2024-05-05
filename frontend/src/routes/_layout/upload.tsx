import { createFileRoute } from "@tanstack/react-router";

import { OpenAPI } from "../../client";

import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { FiFile } from "react-icons/fi";
import FileUpload from "../../components/file-upload";
import { request } from "../../client/core/request";

export const Route = createFileRoute("/_layout/upload")({
  component: UploadPage,
});

type FormValues = {
  file_: FileList;
};

function UploadPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const onSubmit = handleSubmit(async (data) => {
    console.log("On Submit: ", data.file_[0]);

    //upload file to server
    const response = await request(OpenAPI, {
      method: "POST",
      url: "/api/v1/upload/pdf/",
      formData: {
        file: data.file_[0],
      },
      mediaType: "multipart/form-data",
      errors: {
        422: `Validation Error`,
      },
    });

    console.log("Response: ", response);
  });

  const validateFiles = (value: FileList) => {
    if (value.length < 1) {
      return "Files is required";
    }
    for (const file of Array.from(value)) {
      const fsMb = file.size / (1024 * 1024);
      const MAX_FILE_SIZE = 10;
      if (fsMb > MAX_FILE_SIZE) {
        return "Max file size 10mb";
      }
    }
    return true;
  };

  return (
    <Container maxW="full">
      <Box pt={12} m={4}>
        <form onSubmit={onSubmit}>
          <FormControl isInvalid={!!errors.file_} isRequired>
            <FormLabel>{"File input"}</FormLabel>

            <FileUpload
              accept={"pdf/*"}
              multiple
              register={register("file_", { validate: validateFiles })}
            >
              <Button leftIcon={<Icon as={FiFile} />}>Upload</Button>
            </FileUpload>

            <FormErrorMessage>
              {errors.file_ && errors?.file_.message}
            </FormErrorMessage>
          </FormControl>

          <Button mt={4} type="submit">
            Submit
          </Button>
        </form>
      </Box>
    </Container>
  );
}
