import React from "react";
import { Button } from "semantic-ui-react";

export const SigninPage: React.FC = () => {
  return (
    <div>
      <a href="/.auth/login/google">
        <Button>Sign in with Google</Button>
      </a>
    </div>
  );
};
