import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import MediaTable from "../Media/MediaTable";

const MediaTabs = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (_, newValue) => {
    setSelectedTab(newValue);
  };

  const mediaTypes = ["videos", "audios", "photos"];

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          aria-label="media tabs"
        >
          <Tab label="Videos" />
          <Tab label="Audios" />
          <Tab label="Photos" />
        </Tabs>
      </Box>
      <Box sx={{ padding: 2 }}>
        <MediaTable mediaType={mediaTypes[selectedTab]} />
      </Box>
    </Box>
  );
};

export default MediaTabs;
