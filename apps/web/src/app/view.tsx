import React from "react";

import HomeFooter from "~/components/ui/footer";
import { Dashboard } from "~/modules/benchmark";

const HomeView = () => {
  return (
    <>
      <Dashboard />
      <HomeFooter />
    </>
  );
};

export default HomeView;
