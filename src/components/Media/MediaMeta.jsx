import { useEffect, useState } from "react";
import SubtitleEditor from "./SubTitleEditor";
import UpdateField from "./UpdateField";
import { Divider } from "@mui/material";

function MediaMeta({ media, videoRef }) {
  const [formData, setFormData] = useState(null);

  console.log("media from mediaMeta: ", media._id);

  useEffect(() => {
    setFormData(media);
  }, [media]);

  return (
    <div className="mediaMetaBlock">
      <p className="mediaMetaTitle">Media Details</p>
      <div className="mediaMeta">
        <UpdateField media={media} field={"title"} label={"Title"} />
        <UpdateField
          media={media}
          field={"description"}
          fieldType="textarea"
          label={"Description"}
        />

        <UpdateField
          media={media}
          field={"eventLocation"}
          label={"Event location"}
        />
        <UpdateField media={media} field={"eventName"} label={"Event name"} />
      </div>
      <p className="mediaMetaTitle">Timestamps</p>
      <div className="mediaMeta">
        {formData && (
          <SubtitleEditor
            formData={formData}
            setFormData={setFormData}
            editable={true}
            mediaType={"videos"}
            videoRef={videoRef}
          />
        )}
      </div>
    </div>
  );
}

export default MediaMeta;
