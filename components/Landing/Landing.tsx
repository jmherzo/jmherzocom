import {
  Box,
  Flex,
  Heading,
  IconButton,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import styles from "./Landing.module.css";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { ToggleColor } from "../ToogleColorMode";
import { GithubIcon } from "../Icons/Github";
import { LinkedInIcon } from "../Icons/Linkedin";

export function Landing() {
  const gradientColor = useColorModeValue(
    "linear(to-r, #000000,  yellow.500 50%)",
    "linear(to-l, #FFFFFF, #FF0080)",
  );
  const linkColor = useColorModeValue("yellow.500", "pink.300");
  const socialButtonsColor = useColorModeValue("yellow", "pink");
  return (
    <Box py="1rem" px="2rem">
      <Flex as="main" flexDir="column" height="100vh" textAlign="center">
        <Box pb={5} alignSelf="flex-end">
          <ToggleColor />
        </Box>
        <Box flexGrow={1} px={{ lg: "10rem" }}>
          <Flex
            flexDir="column"
            height="100%"
            alignItems="center"
            justifyContent="center"
          >
            <Heading
              as="h1"
              size="2xl"
              bgGradient={gradientColor}
              bgClip="text"
              mb="5"
            >
              Hola, mi nombre es Jesús Manuel Hernández Zozaya!
            </Heading>
            <Box my={2.5}>
              <IconButton
                mr="5"
                fontSize="25px"
                size="lg"
                variant="outline"
                aria-label="Go to github profile"
                colorScheme={socialButtonsColor}
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.open("https://github.com/jmherzo", "_blank");
                  }
                }}
                icon={<GithubIcon />}
              />
              <IconButton
                fontSize="25px"
                size="lg"
                variant="outline"
                aria-label="Go to Linkedin profile"
                colorScheme={socialButtonsColor}
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.open(
                      "https://www.linkedin.com/in/jmherzo/",
                      "_blank",
                    );
                  }
                }}
                icon={<LinkedInIcon />}
              />
            </Box>
            <Text fontSize="2xl" my={5}>
              Soy un Desarrollador de Software Senior{" "}
              <Link isExternal href="https://paypal.com" color="blue.500">
                @PayPal
              </Link>
            </Text>

            <Flex flexDirection="column">
              <Text fontSize="lg" mt={5} mb={2.5}>
                Conoce los proyectos que he creado visitando estos links:
              </Text>
              <Link
                href="https://fastfeedback.jmherzo.com"
                isExternal
                fontSize="lg"
                color={linkColor}
                my={2.5}
              >
                Fastfeedback <ExternalLinkIcon mx="2px" />
              </Link>
              {/* <Link
                href="https://labodadezyj.jmherzo.com"
                isExternal
                fontSize="lg"
                color={linkColor}
                my={2.5}
              >
                La boda de Zyanya y Jesus <ExternalLinkIcon mx="2px" />
              </Link> */}
            </Flex>
          </Flex>
        </Box>
      </Flex>
      <footer className={styles.footer}>
        <Text>©️ Orgullosamente hecho en México 🇲🇽</Text>
      </footer>
    </Box>
  );
}
