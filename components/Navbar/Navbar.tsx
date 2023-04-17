import { useState } from "react";
import {
  Box,
  Flex,
  Spacer,
  Button,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Link,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

interface MenuItem {
  label: string;
  url: string;
}

function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [menuItems] = useState<MenuItem[]>([
    { label: "Home", url: "#" },
    { label: "About", url: "#" },
    { label: "Services", url: "#" },
    { label: "Contact", url: "#" },
  ]);

  return (
    <Box bg="gray.100" px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box>
          <Link href="#">
            <strong>My Website</strong>
          </Link>
        </Box>
        <Spacer />
        <Box display={{ base: "none", md: "flex" }}>
          {menuItems.map((item) => (
            <Link key={item.label} href={item.url} px={2}>
              {item.label}
            </Link>
          ))}
        </Box>
        <Button
          display={{ base: "block", md: "none" }}
          onClick={onOpen}
          variant="ghost"
          size="md"
          ml={2}
        >
          <HamburgerIcon />
        </Button>
      </Flex>

      {/* Drawer */}
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <VStack pt={4} pb={6} spacing={4}>
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.url}
                onClick={onClose}
                fontWeight="medium"
              >
                {item.label}
              </Link>
            ))}
          </VStack>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export { Navbar };
