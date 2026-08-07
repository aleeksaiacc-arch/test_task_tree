import { Box, Heading, Image, SimpleGrid } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import persons from "../data/persons.json";
import type { PeopleById } from "../types";
import { cloudinaryUrl } from "../utils/cloudinary";

const IMG_IDS: string[] = [
  "photo_72_24-02-2026_21-35-38_fq3fzc",
  "photo_71_24-02-2026_21-35-38_v9qggj",
  "photo_69_24-02-2026_21-35-38_dpwxd5",
  "photo_70_24-02-2026_21-35-38_c0t8x6",
  "photo_68_24-02-2026_21-35-38_ea5dki",
  "photo_67_24-02-2026_21-35-38_dyabp8",
  "photo_68_24-02-2026_21-35-38_ea5dki",
  "photo_67_24-02-2026_21-35-38_dyabp8",
  "photo_65_24-02-2026_21-35-38_hfqz4z",
  "photo_63_24-02-2026_21-35-38_fzbk93",
  "photo_66_24-02-2026_21-35-38_a1saam",
  "photo_62_24-02-2026_21-35-38_ksxs9d",
  "photo_64_24-02-2026_21-35-38_koc2vo",
  "photo_61_24-02-2026_21-35-38_esmr1z",
  "photo_58_24-02-2026_21-35-38_ouhuc4",
  "photo_60_24-02-2026_21-35-38_iivnxz",
  "photo_59_24-02-2026_21-35-38_nelbir",
  "photo_56_24-02-2026_21-35-38_ss9irm",
  "photo_57_24-02-2026_21-35-38_xb5riy",
  "photo_49_24-02-2026_21-35-36_wxlfoo",
  "photo_55_24-02-2026_21-35-38_lnkldo",
  "photo_54_24-02-2026_21-35-37_r2xkta",
  "photo_50_24-02-2026_21-35-36_km9m9q",
  "photo_51_24-02-2026_21-35-36_x9hrlx",
  "photo_53_24-02-2026_21-35-36_vjxr9e",
  "photo_52_24-02-2026_21-35-36_lg94st",
  "photo_48_24-02-2026_21-35-36_rrpsoz",
  "photo_47_24-02-2026_21-35-36_byrakd",
  "photo_46_24-02-2026_21-35-36_nhedez",
  "photo_44_24-02-2026_21-35-36_hpadsr",
  "photo_45_24-02-2026_21-35-36_i7rdqh",
  "photo_43_08-01-2026_19-33-34_b1woda",
  "photo_42_08-01-2026_19-31-47_z5u7bt",
  "photo_40_08-01-2026_19-31-08_jahgcb",
  "photo_41_08-01-2026_19-31-27_ay2h41",
  "photo_38_08-01-2026_19-16-31_cbmyj2",
  "photo_39_08-01-2026_19-16-31_rmnqge",
  "photo_37_08-01-2026_17-00-04_uv052p",
  "photo_35_24-09-2025_08-51-25_wvevp3",
  "photo_32_31-07-2025_00-16-58_dtcw9p",
  "photo_34_09-09-2025_18-25-41_wmcztw",
  "photo_16_30-07-2025_18-59-39_dbrt6x",
  "photo_30_31-07-2025_00-03-09_xpvrb1",
  "photo_17_30-07-2025_23-31-55_mnlus7",
  "photo_10_12-07-2025_16-58-20_ueo7d1",
  "photo_29_30-07-2025_23-38-37_zytqft",
  "photo_14_30-07-2025_14-47-06_bl2vxb",
  "photo_23_30-07-2025_23-36-57_apa0ls",
  "photo_13_30-07-2025_14-47-06_ou9xfb",
  "photo_12_30-07-2025_13-10-20_nczsot",
  "photo_11_12-07-2025_16-58-38_a5jtwa",
  "photo_9_19-06-2025_21-17-17_uywplf",
  "photo_7_04-06-2025_12-49-30_hwezrr",
  "photo_20_30-07-2025_23-33-19_cqysd3",
  "photo_19_30-07-2025_23-31-55_vo6dm2",
  "photo_18_30-07-2025_23-31-55_u6shb5",
  "photo_8_04-06-2025_12-50-36_p2xsja",

];

export default function AllPhotosPage() {
  const { t } = useTranslation();
  const allPersons = persons as PeopleById;

  const personPhotos = Object.entries(allPersons)
    .filter(([, person]) => person.photoUrl && person.photoUrl.length > 0)
    .map(([id, person]) => ({ id, photoUrl: person.photoUrl! }));

  const standalonePhotos = IMG_IDS.filter((imgId) => !personPhotos.some((p) => p.photoUrl === imgId));

  return (
    <Box maxW="1400px" mx="auto" py={4}>
      <Heading size="lg" mb={6}>
        {t("allPhotos")}
      </Heading>

      <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }} gap={3}>
        {personPhotos.map(({ id, photoUrl }) => (
          <Link key={id} to={`/person/${id}`} style={{ textDecoration: "none" }}>
            <Box
              borderRadius="md"
              overflow="hidden"
              _hover={{ shadow: "lg", transform: "scale(1.02)" }}
              transition="all 0.2s"
              cursor="pointer"
            >
              <Image
                src={cloudinaryUrl(photoUrl, { width: 400, height: 400, crop: "fill" })}
                alt=""
                w="100%"
                aspectRatio="1"
                objectFit="cover"
                loading="lazy"
              />
              <p>{photoUrl}</p>
            </Box>
          </Link>
        ))}

        {standalonePhotos.map((imgId) => (
          <Box
            key={imgId}
            borderRadius="md"
            overflow="hidden"
          >
            <Image
              src={cloudinaryUrl(imgId, { width: 400, height: 400, crop: "fill" })}
              alt=""
              w="100%"
              aspectRatio="1"
              objectFit="cover"
              loading="lazy"
            /> <p>{imgId}</p>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
