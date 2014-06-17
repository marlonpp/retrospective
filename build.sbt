name := "retrospective"

version := "1.0-SNAPSHOT"

libraryDependencies ++= Seq(
  anorm, filters,
  "com.google.inject" % "guice" % "3.0",
  "com.google.collections" % "google-collections" % "1.0-rc5",
  "org.mongodb" % "mongo-java-driver" % "2.11.4",
  "org.jongo" % "jongo" % "1.1-early-20140221-1732",
  "commons-io" % "commons-io" % "2.4",
  "org.apache.poi" % "poi" % "3.9",
  "org.apache.poi" % "poi-ooxml" % "3.9",
  "org.skyscreamer" % "jsonassert" % "1.2.3"
)

play.Project.playJavaSettings

play.Project.playScalaSettings

resolvers += "cloudbees-jongo-early-release" at "http://repository-jongo.forge.cloudbees.com/release/"
