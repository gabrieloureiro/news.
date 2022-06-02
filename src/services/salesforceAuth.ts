import axios from "axios";
import qs from "qs";
import jsforce from "jsforce";

export async function salesforceAuth() {
  const { data } = await axios.post(
    process.env.NEXT_PUBLIC_SALESFORCE_OAUTH_URL,
    qs.stringify({
      grant_type: "password",
      client_id: process.env.NEXT_PUBLIC_SALESFORCE_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_SALESFORCE_CLIENT_SECRET,
      username: process.env.NEXT_PUBLIC_SALESFORCE_USERNAME,
      password: process.env.NEXT_PUBLIC_SALESFORCE_PASSWORD,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
  return data;
}
