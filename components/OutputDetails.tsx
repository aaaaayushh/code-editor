import React from "react";

const OutputDetails = ({ outputDetails }) => {
  return (
    <div className="mt-4">
      <p className="text-sm">
        Status:{" "}
        <span className="font-bold px-2 py-1">
          {outputDetails?.status?.description}
        </span>
      </p>
      <p className="text-sm">
        Memory:{" "}
        <span className="font-bold px-2 py-1">{outputDetails?.memory}</span>
      </p>
      <p className="text-sm">
        Time: <span className="font-bold px-2 py-1">{outputDetails?.time}</span>
      </p>
    </div>
  );
};

export default OutputDetails;
