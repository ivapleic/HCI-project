import * as contentfulManagement from "contentful-management";


const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!;
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_CONTENTFUL_MANAGEMENT_ACCESS_TOKEN!;

const mgmtClient = contentfulManagement.createClient({
  accessToken: ACCESS_TOKEN,
});

export default mgmtClient;

