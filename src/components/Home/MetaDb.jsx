import React from "react";

function MetaDb({ meta }) {
  if (!meta) {
    return <p style={{ padding: "16px" }}>Loading metadata</p>;
  }

  console.log(meta);

  return (
    <div>
      <div className="statsHeader">
        <strong>Current Statistics</strong>
        <p style={{ marginBottom: "8px", marginTop: "8px" }}>
          Total Media: {meta.totalMedia}
        </p>
        <p style={{ marginBottom: "8px", marginTop: "8px" }}>
          Total Videos: {meta.videos}
        </p>
        <p style={{ marginBottom: "8px", marginTop: "8px" }}>
          Total Audios: {meta.audios ? meta.audios : 0}
        </p>
        <p style={{ marginBottom: "8px", marginTop: "8px" }}>
          Total Photos: {meta.photos ? meta.photos : 0}
        </p>
      </div>
    </div>
  );
}

export default MetaDb;
