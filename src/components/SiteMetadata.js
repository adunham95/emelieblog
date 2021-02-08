import { graphql, useStaticQuery } from 'gatsby'
import customSiteMetaData from "../../data/meta.json"

const useSiteMetadata = () => {

  console.log("customSiteMetaData",customSiteMetaData)

  const { site } = useStaticQuery(
    graphql`
      query SITE_METADATA_QUERY {
        site {
          siteMetadata {
            title
            description
          }
        }
      }
    `
  )
  return {...site.siteMetadata, ...customSiteMetaData}
}

export default useSiteMetadata
