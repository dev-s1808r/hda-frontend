import { useNavigate } from "react-router-dom";
import "./home.css";
import useGetDbMeta from "../../api/data/dbMeta";
import MetaDb from "../../components/Home/MetaDb";

const options = [
  { path: "assignment", label: "Assigned media" },
  { path: "all-media", label: "Verify media" },
  { path: "scan-media", label: "Scan media" },
  { path: "logs", label: "Logs" },
];

function Home() {
  const navigate = useNavigate();

  function handleNavigate(path) {
    navigate(`/${path}`);
  }

  const { meta } = useGetDbMeta();

  return (
    <div className="home">
      <ul className="optionList">
        {options.map((option, index) => (
          <li
            key={index}
            className="option"
            onClick={() => handleNavigate(option.path)}
          >
            {option.label}
          </li>
        ))}
      </ul>
      <div className="stats">
        <MetaDb meta={meta} />
      </div>

      <p className="intro">
        <strong style={{ marginBottom: "8px" }}>
          Welcome to the Hari Krishna Mandir Digital Archiving System
        </strong>

        <p style={{ marginBottom: "8px", marginTop: "8px" }}>
          We are delighted to have you here and deeply grateful for your
          participation in this noble and meaningful endeavor. This platform is
          dedicated to preserving and celebrating the rich spiritual legacy of
          Ma Indira Devi and Dadaji, whose lives have inspired generations with
          their wisdom, compassion, and unwavering devotion.
        </p>

        <p style={{ marginBottom: "8px" }}>
          Through this digital archive, we aim to collect, organize, and share
          rare documents, photographs, discourses, and personal memories that
          capture the profound impact of their teachings and service. By
          contributing to this initiative, you are helping to ensure that future
          generations can access, learn from, and remain connected to this
          sacred heritage.
        </p>

        <p style={{ marginBottom: "8px" }}>
          Together, let us revive and protect history—not just as a collection
          of moments from the past, but as a living source of insight, faith,
          and inspiration for the future.
        </p>
      </p>
    </div>
  );
}

export default Home;

//  <Box
// sx={{
//   display: "flex",
//   flexDirection: { xs: "column", md: "row" },
//   gap: 2,
//   maxWidth: "100vw",
//   overflow: "hidden",
//   mt: 3,
//   maxHeight: "90dvh",
//   overflowY: "auto",
// }}
// >
// {/* Media Display */}
// <Box
//   sx={{
//     flex: 1,
//     minWidth: 0,
//     maxWidth: "100%",
//     overflowX: "auto",
//   }}
// >
//   {userDetails && (
//     <MediaDisplay
//       handleMarkCompleted={handleMarkCompleted}
//       userDetails={userDetails}
//       refetchCurrentUser={refetchCurrentUser}
//     />
//   )}
// </Box>

// {/* Media Tabs */}
// {userDetails?.role === "admin" && (
//   <Box
//     sx={{
//       flex: 1,
//       minWidth: 0,
//       maxWidth: "100%",
//       overflowX: "auto",
//     }}
//   >
//     <MediaTabs />
//   </Box>
// )}
// </Box>
