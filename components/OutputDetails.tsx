import React from "react";

const OutputDetails = ({ outputDetails }) => {
  if (outputDetails) {
    return (
      <div className="mt-4 pl-2">
        <p className="text-lg my-2">
          Status:{" "}
          <span className="font-bold px-2 py-1 bg-gray-200 rounded-lg">
            {outputDetails?.status?.description}
          </span>
        </p>
        <p className="text-lg my-2">
          Memory:{" "}
          <span className="font-bold px-2 py-1 bg-gray-200 rounded-lg">
            {outputDetails?.memory}
          </span>
        </p>
        <p className="text-lg my-2">
          Time:{" "}
          <span className="font-bold px-2 py-1 bg-gray-200 rounded-lg">
            {outputDetails?.time}s
          </span>
        </p>
      </div>
    );
  }
  return <></>;
};

export default OutputDetails;
