import React from "react";
import { Button } from "semantic-ui-react";
import { Link } from "react-router-dom";

export const SigninPage: React.FC = () => {
  return (
    <div>
      <Link to="/.auth/login/google">
        <Button>Sign in with Google</Button>
      </Link>
    </div>
  );
};
