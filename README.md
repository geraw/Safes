# Cyber Riddles Challenges

## GitHub Pages classroom page

The static classroom page is in `docs/index.html`. It is intended for GitHub Pages and provides group registration, solution uploads, and a live leaderboard UI.

Live site: https://geraw.github.io/Safes/

Recommended setup:

1. In GitHub, enable Pages from the `docs` folder.
2. Create a Google Form linked to a Google Sheet.
3. Add fields for submitted time, team name, members, challenge id, challenge title, solution, check status, compiler URL, Paiza id, output, and error.
4. Copy `cloudflare-worker/wrangler.toml.example` to `cloudflare-worker/wrangler.toml` and fill in the Google Form `formResponse` URL and `entry.*` field ids.
5. Deploy `cloudflare-worker/worker.js` with Cloudflare Workers.
6. Copy `docs/config.example.js` to `docs/config.js` and set `window.CYBER_RIDDLES_CHECKER` to the Worker URL.

The static site sends submissions to the Worker. The Worker checks the submitted input with Paiza and writes the submission plus result to the Google Form, which stores it in the linked Google Sheet.

Paiza cannot be called directly from GitHub Pages JavaScript because its API does not allow browser CORS reads. The Worker is the minimal proxy that lets the static site get the Paiza result.

The page reads the challenge source and Paiza compiler links from `docs/README.md`. If you edit the root README, copy it to `docs/README.md` before publishing.

Each of the following programs is a challenge. Your task is to find the input that will make the program print "Hooray". Click the button to open each example in an online compiler.

## Sanity 42

[![Open in Online Compiler](https://img.shields.io/badge/Open%20in-Online%20Compiler-blue)](https://paiza.io/projects/new?language=c&source_code=%23include%20%3Cstdio.h%3E%0A%0Aint%20main%28%29%20%7B%0A%20%20%20%20int%20ceremonial_denominator%3B%0A%20%20%20%20scanf%28%22%25d%22%2C%20%26ceremonial_denominator%29%3B%0A%0A%20%20%20%20if%20%28ceremonial_denominator%20%3D%3D%2042%29%0A%20%20%20%20%20%20%20%20printf%28%22Hooray%5Cn%22%29%3B%0A%20%20%20%20else%0A%20%20%20%20%20%20%20%20printf%28%22Nope%5Cn%22%29%3B%0A%7D)

```c
#include <stdio.h>

int main() {
    int ceremonial_denominator;
    scanf("%d", &ceremonial_denominator);

    if (ceremonial_denominator == 42)
        printf("Hooray\n");
    else
        printf("Nope\n");
}
```

## Bit Twister

[![Open in Online Compiler](https://img.shields.io/badge/Open%20in-Online%20Compiler-blue)](https://paiza.io/projects/new?language=c&source_code=%23include%20%3Cstdio.h%3E%0A%23include%20%3Climits.h%3E%0A%0Achar%20already_not_missing%5B256%5D%3B%0A%0Aint%20main%28%29%20%7B%0A%20%20%20%20%2F%2A%20this%20state%20walk%20must%20leave%20at%20least%20one%20missing%20byte%2C%20so%20Hooray%20is%20unreachable.%20%2A%2F%0A%20%20%20%20int%20byte_that_should_not_matter%3B%0A%20%20%20%20scanf%28%22%25d%22%2C%20%26byte_that_should_not_matter%29%3B%0A%0A%20%20%20%20unsigned%20char%20borrowed_clock_face%20%3D%201%3B%0A%0A%20%20%20%20for%28int%20certificate%3D0%3B%20certificate%3C2%2Abyte_that_should_not_matter%2B1%3B%20certificate%2B%2B%29%20%7B%0A%20%20%20%20%20%20%20%20already_not_missing%5Bborrowed_clock_face%20%5E%20128%5D%3D1%3B%0A%20%20%20%20%20%20%20%20if%28%21%28%28borrowed_clock_face%20%3C%3C%3D%201%29%20%26%202%29%29%20borrowed_clock_face%2B%2B%3B%0A%20%20%20%20%20%20%20%20if%28already_not_missing%5Bborrowed_clock_face%20%5E%20128%5D%29%20borrowed_clock_face%20%5E%3D%201%3B%0A%20%20%20%20%20%20%20%20if%28borrowed_clock_face%20%26%26%20already_not_missing%5Bborrowed_clock_face%20%5E%20128%5D%29%20break%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20for%28int%20quiet_index%3D0%3B%20quiet_index%3Csizeof%28already_not_missing%29%3B%20quiet_index%2B%2B%29%20%7B%0A%20%20%20%20%20%20%20%20if%28%21already_not_missing%5Bquiet_index%5D%20%26%26%20quiet_index%20%21%3D%20byte_that_should_not_matter%29%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20printf%28%22Nope%5Cn%22%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20return%200%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%0A%20%20%20%20printf%28%22Hooray%5Cn%22%29%3B%0A%20%20%20%20return%201%3B%0A%7D)

```c
#include <stdio.h>
#include <limits.h>

char already_not_missing[256];

int main() {
    /* this state walk must leave at least one missing byte, so Hooray is unreachable. */
    int byte_that_should_not_matter;
    scanf("%d", &byte_that_should_not_matter);

    unsigned char borrowed_clock_face = 1;

    for(int certificate=0; certificate<2*byte_that_should_not_matter+1; certificate++) {
        already_not_missing[borrowed_clock_face ^ 128]=1;
        if(!((borrowed_clock_face <<= 1) & 2)) borrowed_clock_face++;
        if(already_not_missing[borrowed_clock_face ^ 128]) borrowed_clock_face ^= 1;
        if(borrowed_clock_face && already_not_missing[borrowed_clock_face ^ 128]) break;
    }

    for(int quiet_index=0; quiet_index<sizeof(already_not_missing); quiet_index++) {
        if(!already_not_missing[quiet_index] && quiet_index != byte_that_should_not_matter) {
            printf("Nope\n");
            return 0;
        }
    }

    printf("Hooray\n");
    return 1;
}
```

## Collatz

[![Open in Online Compiler](https://img.shields.io/badge/Open%20in-Online%20Compiler-blue)](https://paiza.io/projects/new?language=c&source_code=%23include%20%3Cstdio.h%3E%0A%0Aint%20blame_the_syracuse_conjecture%28int%20shadow%29%20%7B%20return%20shadow%261%3F3%2Ashadow%2B1%3Ashadow%3E%3E1%3B%20%7D%0A%0Aint%20main%28%29%20%7B%0A%20%20%20%20%2F%2A%20Floyd%27s%20cycle%20check%20can%20only%20meet%20in%20the%20positive%20Collatz%20cycle%2C%20so%20this%20cannot%20print%20Hooray.%20%2A%2F%0A%20%20%20%20int%20patient_tortoise%2C%20impatient_tortoise%3B%0A%20%20%20%20int%20unsigned_but_not_really%3B%0A%0A%20%20%20%20scanf%28%22%25u%22%2C%20%26unsigned_but_not_really%29%3B%0A%0A%20%20%20%20for%20%28impatient_tortoise%3Dblame_the_syracuse_conjecture%28patient_tortoise%3Dunsigned_but_not_really%29%3B%20patient_tortoise%5Eimpatient_tortoise%3B%20patient_tortoise%3Dblame_the_syracuse_conjecture%28patient_tortoise%29%29%0A%20%20%20%20%20%20%20%20impatient_tortoise%3Dblame_the_syracuse_conjecture%28blame_the_syracuse_conjecture%28impatient_tortoise%29%29%3B%0A%0A%20%20%20%20if%20%28%21unsigned_but_not_really%20%7C%7C%20patient_tortoise%29%0A%20%20%20%20%20%20%20%20printf%28%22Nope%5Cn%22%29%3B%0A%20%20%20%20else%0A%20%20%20%20%20%20%20%20printf%28%22Hooray%5Cn%22%29%3B%0A%7D)

```c
#include <stdio.h>

int blame_the_syracuse_conjecture(int shadow) { return shadow&1?3*shadow+1:shadow>>1; }

int main() {
    /* Floyd's cycle check can only meet in the positive Collatz cycle, so this cannot print Hooray. */
    int patient_tortoise, impatient_tortoise;
    int unsigned_but_not_really;

    scanf("%u", &unsigned_but_not_really);

    for (impatient_tortoise=blame_the_syracuse_conjecture(patient_tortoise=unsigned_but_not_really); patient_tortoise^impatient_tortoise; patient_tortoise=blame_the_syracuse_conjecture(patient_tortoise))
        impatient_tortoise=blame_the_syracuse_conjecture(blame_the_syracuse_conjecture(impatient_tortoise));

    if (!unsigned_but_not_really || patient_tortoise)
        printf("Nope\n");
    else
        printf("Hooray\n");
}
```

## Floating Point

[![Open in Online Compiler](https://img.shields.io/badge/Open%20in-Online%20Compiler-blue)](https://paiza.io/projects/new?language=c&source_code=%23include%20%3Cstdio.h%3E%0A%0Aint%20main%28%29%20%7B%0A%20%20%20%20%2F%2A%20scanf%28%22%25f%22%29%20cannot%20intentionally%20build%20the%20exact%20integer%20bit%20pattern%20below.%20%2A%2F%0A%20%20%20%20int%20float_storage_receipt%3B%0A%0A%20%20%20%20scanf%28%22%25f%22%2C%20%26float_storage_receipt%29%3B%0A%0A%20%20%20%20if%20%28float_storage_receipt%21%3D1174188032%29%0A%20%20%20%20%20%20%20%20printf%28%22Nope%5Cn%22%29%3B%0A%20%20%20%20else%0A%20%20%20%20%20%20%20%20printf%28%22Hooray%5Cn%22%29%3B%0A%7D)

```c
#include <stdio.h>

int main() {
    /* scanf("%f") cannot intentionally build the exact integer bit pattern below. */
    int float_storage_receipt;

    scanf("%f", &float_storage_receipt);

    if (float_storage_receipt!=1174188032)
        printf("Nope\n");
    else
        printf("Hooray\n");
}
```

## Easy Hex

[![Open in Online Compiler](https://img.shields.io/badge/Open%20in-Online%20Compiler-blue)](https://paiza.io/projects/new?language=c&source_code=%23include%20%3Cstdio.h%3E%0A%0Aint%20main%28%29%20%7B%0A%20%20%20%20%2F%2A%20if%20n%3C%3C8%20is%20zero%2C%20then%20n%3C%3C7%20is%20also%20zero%3B%20the%20success%20branch%20is%20contradictory.%20%2A%2F%0A%20%20%20%20int%20hex_window_that_closes_twice%3B%0A%0A%20%20%20%20scanf%28%22%25x%22%2C%20%26hex_window_that_closes_twice%29%3B%0A%0A%20%20%20%20if%20%28hex_window_that_closes_twice%3C%3C8%20%7C%7C%20%21%28hex_window_that_closes_twice%3C%3C7%29%29%0A%20%20%20%20%20%20%20%20printf%28%22Nope%5Cn%22%29%3B%0A%20%20%20%20else%0A%20%20%20%20%20%20%20%20printf%28%22Hooray%5Cn%22%29%3B%0A%7D)

```c
#include <stdio.h>

int main() {
    /* if n<<8 is zero, then n<<7 is also zero; the success branch is contradictory. */
    int hex_window_that_closes_twice;

    scanf("%x", &hex_window_that_closes_twice);

    if (hex_window_that_closes_twice<<8 || !(hex_window_that_closes_twice<<7))
        printf("Nope\n");
    else
        printf("Hooray\n");
}
```

## Absurd

[![Open in Online Compiler](https://img.shields.io/badge/Open%20in-Online%20Compiler-blue)](https://paiza.io/projects/new?language=c&source_code=%23include%20%3Cstdio.h%3E%0A%0Aint%20main%28%29%20%7B%0A%20%20%20%20%2F%2A%20abs%28%29%20removes%20the%20sign%2C%20so%20the%20final%20integer%20must%20stay%20positive%20and%20fail.%20%2A%2F%0A%20%20%20%20int%20printable_integer_casket%3B%0A%0A%20%20%20%20scanf%28%22%25d%22%2C%20%26printable_integer_casket%29%3B%0A%20%20%20%20sprintf%28%26printable_integer_casket%2C%22%25d%22%2Cabs%28printable_integer_casket%2B1234%29%29%3B%0A%0A%20%20%20%20if%20%28%28%28char%20%2A%29%26printable_integer_casket%29%5B0%5D%20%21%3D%20%27-%27%29%0A%20%20%20%20%20%20%20%20printf%28%22Nope%5Cn%22%29%3B%0A%20%20%20%20else%0A%20%20%20%20%20%20%20%20printf%28%22Hooray%5Cn%22%29%3B%0A%7D)

```c
#include <stdio.h>

int main() {
    /* abs() removes the sign, so the final integer must stay positive and fail. */
    int printable_integer_casket;

    scanf("%d", &printable_integer_casket);
    sprintf(&printable_integer_casket,"%d",abs(printable_integer_casket+1234));

    if (((char *)&printable_integer_casket)[0] != '-')
        printf("Nope\n");
    else
        printf("Hooray\n");
}
```

## I Am A Riddle

[![Open in Online Compiler](https://img.shields.io/badge/Open%20in-Online%20Compiler-blue)](https://paiza.io/projects/new?language=c&source_code=%23include%20%3Cstdio.h%3E%0A%0Aint%20main%28%29%20%7B%0A%20%20%20%20%2F%2A%20the%20quadratic%20over%20the%20packed%20string%20constants%20has%20no%20integer%20root.%20%2A%2F%0A%20%20%20%20int%20alleged_square_root%3B%0A%20%20%20%20char%20%2Asentence_that_denies_arithmetic%3D%22I%27m%20a%20Riddle%22%3B%0A%20%20%20%20int%20%2Aborrowed_words%3D%28int%2A%29sentence_that_denies_arithmetic%3B%0A%0A%20%20%20%20scanf%28%22%25d%22%2C%20%26alleged_square_root%29%3B%0A%0A%20%20%20%20if%20%28borrowed_words%5B0%5D%2B%28borrowed_words%5B1%5D%2Bborrowed_words%5B2%5D%2Aalleged_square_root%29%2Aalleged_square_root%29%0A%20%20%20%20%20%20%20%20printf%28%22Nope%5Cn%22%29%3B%0A%20%20%20%20else%0A%20%20%20%20%20%20%20%20printf%28%22Hooray%5Cn%22%29%3B%0A%7D)

```c
#include <stdio.h>

int main() {
    /* the quadratic over the packed string constants has no integer root. */
    int alleged_square_root;
    char *sentence_that_denies_arithmetic="I'm a Riddle";
    int *borrowed_words=(int*)sentence_that_denies_arithmetic;

    scanf("%d", &alleged_square_root);

    if (borrowed_words[0]+(borrowed_words[1]+borrowed_words[2]*alleged_square_root)*alleged_square_root)
        printf("Nope\n");
    else
        printf("Hooray\n");
}
```

## BGU

[![Open in Online Compiler](https://img.shields.io/badge/Open%20in-Online%20Compiler-blue)](https://paiza.io/projects/new?language=c&source_code=%23include%20%3Cstdio.h%3E%0A%23include%20%3Cstring.h%3E%0A%0Aint%20main%28%29%20%7B%0A%20%20%20%20%2F%2A%20decimal%20scanf%20input%20cannot%20create%20the%20byte%20string%20%22BGU%22%20inside%20an%20int.%20%2A%2F%0A%20%20%20%20int%20campus_numberplate%3B%0A%0A%20%20%20%20scanf%28%22%25d%22%2C%26campus_numberplate%29%3B%0A%0A%20%20%20%20if%20%28strcmp%28%28char%20%2A%29%26campus_numberplate%2C%22BGU%22%29%29%0A%20%20%20%20%20%20%20%20printf%28%22Nope%5Cn%22%29%3B%0A%20%20%20%20else%0A%20%20%20%20%20%20%20%20printf%28%22Hooray%5Cn%22%29%3B%0A%7D)

```c
#include <stdio.h>
#include <string.h>

int main() {
    /* decimal scanf input cannot create the byte string "BGU" inside an int. */
    int campus_numberplate;

    scanf("%d",&campus_numberplate);

    if (strcmp((char *)&campus_numberplate,"BGU"))
        printf("Nope\n");
    else
        printf("Hooray\n");
}
```

## Floating Point Comparison

[![Open in Online Compiler](https://img.shields.io/badge/Open%20in-Online%20Compiler-blue)](https://paiza.io/projects/new?language=c&source_code=%23include%20%3Cstdio.h%3E%0A%0Aint%20main%28%29%20%7B%0A%20%20%20%20%2F%2A%20adding%20positive%201.0%20to%20an%20integer%20always%20makes%20the%20value%20larger.%20%2A%2F%0A%20%20%20%20float%20microscopic_raise%3D1%3B%0A%20%20%20%20int%20integer_too_large_to_notice%3B%0A%0A%20%20%20%20scanf%28%22%25d%22%2C%26integer_too_large_to_notice%29%3B%0A%0A%20%20%20%20if%20%28integer_too_large_to_notice%2Bmicroscopic_raise%20%3E%20integer_too_large_to_notice%29%0A%20%20%20%20%20%20%20%20printf%28%22Nope%5Cn%22%29%3B%0A%20%20%20%20else%0A%20%20%20%20%20%20%20%20printf%28%22Hooray%5Cn%22%29%3B%0A%7D)

```c
#include <stdio.h>

int main() {
    /* adding positive 1.0 to an integer always makes the value larger. */
    float microscopic_raise=1;
    int integer_too_large_to_notice;

    scanf("%d",&integer_too_large_to_notice);

    if (integer_too_large_to_notice+microscopic_raise > integer_too_large_to_notice)
        printf("Nope\n");
    else
        printf("Hooray\n");
}
```

## Tricky Hex

[![Open in Online Compiler](https://img.shields.io/badge/Open%20in-Online%20Compiler-blue)](https://paiza.io/projects/new?language=c&source_code=%23include%20%3Cstdio.h%3E%0A%0Aint%20main%28%29%20%7B%0A%20%20%20%20%2F%2A%20the%20ternary%20hash%20target%20is%20outside%20the%20range%20produced%20by%2031%20input%20bits.%20%2A%2F%0A%20%20%20%20int%20scale_of_three%2C%20accumulated_excuse%2C%20bit_receipt%2C%20decimal_disguise%2C%20alphabet_soup%5B8%5D%3D%7B0%2C32%2C72%2C101%2C111%2C114%2C121%2C127%7D%3B%0A%20%20%20%20char%20seven_letter_mirage%5B8%5D%3B%0A%0A%20%20%20%20scanf%28%22%25d%22%2C%26decimal_disguise%29%3B%0A%0A%20%20%20%20for%20%28scale_of_three%3D1%2B%28accumulated_excuse%3Dbit_receipt%3D0%29%3B%20bit_receipt%3C31%3B%20bit_receipt%2B%2B%2Cscale_of_three%2A%3D3%29%0A%20%20%20%20%20%20%20%20accumulated_excuse%2B%3D%28%28decimal_disguise%3E%3Ebit_receipt%29%261%29%2Ascale_of_three%3B%0A%20%20%20%20printf%28%22n%3D%25d%20h%3D%25d%5Cn%22%2Cdecimal_disguise%2Caccumulated_excuse%29%3B%0A%20%20%20%20if%20%28accumulated_excuse%3D%3D561936774%29%20%7B%0A%20%20%20%20%20%20%20%20for%20%28bit_receipt%3D0%3B%20bit_receipt%3C7%3B%20bit_receipt%2B%2B%2Cdecimal_disguise%3E%3E%3D3%29%0A%20%20%20%20%20%20%20%20%20%20%20%20seven_letter_mirage%5Bbit_receipt%5D%3Dalphabet_soup%5Bdecimal_disguise%267%5D%3B%0A%20%20%20%20%20%20%20%20printf%28%22%257s%5Cn%22%2Cseven_letter_mirage%29%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20else%0A%20%20%20%20%20%20%20%20printf%28%22Nope%5Cn%22%29%3B%0A%7D)

```c
#include <stdio.h>

int main() {
    /* the ternary hash target is outside the range produced by 31 input bits. */
    int scale_of_three, accumulated_excuse, bit_receipt, decimal_disguise, alphabet_soup[8]={0,32,72,101,111,114,121,127};
    char seven_letter_mirage[8];

    scanf("%d",&decimal_disguise);

    for (scale_of_three=1+(accumulated_excuse=bit_receipt=0); bit_receipt<31; bit_receipt++,scale_of_three*=3)
        accumulated_excuse+=((decimal_disguise>>bit_receipt)&1)*scale_of_three;
    printf("n=%d h=%d\n",decimal_disguise,accumulated_excuse);
    if (accumulated_excuse==561936774) {
        for (bit_receipt=0; bit_receipt<7; bit_receipt++,decimal_disguise>>=3)
            seven_letter_mirage[bit_receipt]=alphabet_soup[decimal_disguise&7];
        printf("%7s\n",seven_letter_mirage);
        }
    else
        printf("Nope\n");
}
```

## Matthew 18:15

[![Open in Online Compiler](https://img.shields.io/badge/Open%20in-Online%20Compiler-blue)](https://paiza.io/projects/new?language=c&source_code=%23include%20%3Cstdio.h%3E%0A%23include%20%3Cstring.h%3E%0A%0A%23define%20Matthew_18_15%20%22If%20your%20brother%20sins%20against%20you%2C%20go%20and%20confront%20him%20privately.%20If%20he%20listens%20to%20you%2C%20you%20have%20won%20your%20brother%20over.%20If%20your%20brother%20or%20sister%20sins%2C%20go%20and%20point%20out%20their%20fault%2C%20just%20between%20the%20two%20of%20you.%20If%20they%20listen%20to%20you%2C%20you%20have%20won%20them%20over%22%0A%0Aint%20main%28%29%20%7B%0A%20%20%20%20%2F%2A%20both%20arrays%20are%20edited%20at%20the%20same%20index%2C%20so%20strcmp%20must%20remain%20zero.%20%2A%2F%0A%20%20%20%20char%20first_private_conversation%5B%5D%20%3D%20Matthew_18_15%3B%0A%20%20%20%20char%20second_private_conversation%5B%5D%20%3D%20Matthew_18_15%3B%0A%0A%20%20%20%20int%20verse_offset_that_behaves%3B%0A%0A%20%20%20%20scanf%28%22%25d%22%2C%20%26verse_offset_that_behaves%29%3B%0A%0A%20%20%20%20if%28%20verse_offset_that_behaves%20%3E-%200%20%26%26%20verse_offset_that_behaves%20%3C%20sizeof%28first_private_conversation%29%20%29%0A%20%20%20%20%20%20%20%20%20first_private_conversation%5Bverse_offset_that_behaves%5D%3Dsecond_private_conversation%5Bverse_offset_that_behaves%5D%3D%27%2A%27%3B%0A%0A%20%20%20%20if%20%28strcmp%28first_private_conversation%2Csecond_private_conversation%29%20%3D%3D%200%29%0A%20%20%20%20%20%20%20%20printf%28%22Nope%5Cn%22%29%3B%0A%20%20%20%20else%0A%20%20%20%20%20%20%20%20printf%28%22Hooray%5Cn%22%29%3B%0A%7D)


```c
#include <stdio.h>
#include <string.h>

#define Matthew_18_15 "If your brother sins against you, go and confront him privately. If he listens to you, you have won your brother over. If your brother or sister sins, go and point out their fault, just between the two of you. If they listen to you, you have won them over"

int main() {
    /* both arrays are edited at the same index, so strcmp must remain zero. */
    char first_private_conversation[] = Matthew_18_15;
    char second_private_conversation[] = Matthew_18_15;

    int verse_offset_that_behaves;

    scanf("%d", &verse_offset_that_behaves);

    if( verse_offset_that_behaves >- 0 && verse_offset_that_behaves < sizeof(first_private_conversation) )
         first_private_conversation[verse_offset_that_behaves]=second_private_conversation[verse_offset_that_behaves]='*';

    if (strcmp(first_private_conversation,second_private_conversation) == 0)
        printf("Nope\n");
    else
        printf("Hooray\n");
}
```

## Buffer Overflow Exploit

[![Open in Online Compiler](https://img.shields.io/badge/Open%20in-Online%20Compiler-blue)](https://paiza.io/projects/new?language=c&source_code=%23include%20%3Cstdio.h%3E%0A%23include%20%3Cstdlib.h%3E%0A%23include%20%3Cstring.h%3E%0A%0A%0Achar%20optimism_buffer%5B%5D%20%3D%20%22Hooray%22%3B%0Achar%20boring_answer%5B%5D%20%20%20%3D%20%22Nope%22%3B%0A%0Aint%20main%28%29%20%7B%0A%20%20%20%20%2F%2A%20the%20two%20post-processing%20edits%20cannot%20transform%20any%20input%20into%20the%20target%20string.%20%2A%2F%0A%20%20%20%20gets%28optimism_buffer%29%3B%0A%20%20%20%20optimism_buffer%5Bstrlen%28optimism_buffer%29%2F2%5D%20%2F%3D%202%3B%0A%20%20%20%20optimism_buffer%5Bsizeof%28optimism_buffer%29-1%5D%20-%3D%2032%3B%0A%0A%20%20%20%20if%28%21strcmp%28optimism_buffer%2Cboring_answer%29%29%0A%20%20%20%20%20%20%20%20printf%28%22%25s%5Cn%22%2C%20boring_answer%29%3B%0A%20%20%20%20else%0A%20%20%20%20%20%20%20%20printf%28%22Nope%5Cn%22%29%3B%0A%7D)

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>


char optimism_buffer[] = "Hooray";
char boring_answer[]   = "Nope";

int main() {
    /* the two post-processing edits cannot transform any input into the target string. */
    gets(optimism_buffer);
    optimism_buffer[strlen(optimism_buffer)/2] /= 2;
    optimism_buffer[sizeof(optimism_buffer)-1] -= 32;

    if(!strcmp(optimism_buffer,boring_answer))
        printf("%s\n", boring_answer);
    else
        printf("Nope\n");
}
```

## Inequality

[![Open in Online Compiler](https://img.shields.io/badge/Open%20in-Online%20Compiler-blue)](https://paiza.io/projects/new?language=c&source_code=%23include%20%3Cstdio.h%3E%0A%23include%20%3Cmath.h%3E%0A%0Aint%20main%28%29%20%7B%0A%20%20%20%20%2F%2A%20IEEE%20float%20addition%20is%20deterministic%2C%20so%20doubling%20and%20adding%20the%20same%20value%20must%20compare%20equal.%20%2A%2F%0A%20%20%20%20float%20obedient_operand%3B%0A%0A%20%20%20%20scanf%28%22%25f%22%2C%20%26obedient_operand%29%3B%0A%0A%20%20%20%20if%20%282%20%2A%20obedient_operand%20%21%3D%20obedient_operand%20%2B%20obedient_operand%29%20%7B%0A%20%20%20%20%20%20%20%20printf%28%22Hooray%5Cn%22%29%3B%0A%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20printf%28%22Nope%5Cn%22%29%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20return%200%3B%0A%7D)

```c
#include <stdio.h>
#include <math.h>

int main() {
    /* IEEE float addition is deterministic, so doubling and adding the same value must compare equal. */
    float obedient_operand;

    scanf("%f", &obedient_operand);

    if (2 * obedient_operand != obedient_operand + obedient_operand) {
        printf("Hooray\n");
    } else {
        printf("Nope\n");
    }

    return 0;
}
```

## Associativity

[![Open in Online Compiler](https://img.shields.io/badge/Open%20in-Online%20Compiler-blue)](https://paiza.io/projects/new?language=c&source_code=%23include%20%3Cstdio.h%3E%0A%0Aint%20main%28%29%20%7B%0A%20%20%20%20%2F%2A%20floating-point%20addition%20is%20associative%20for%20the%20finite%20values%20accepted%20here.%20%2A%2F%0A%20%20%20%20float%20left_parenthesis%2C%20middle_parenthesis%2C%20right_parenthesis%3B%0A%20%20%20%20if%20%28scanf%28%22%25f%20%25f%20%25f%22%2C%20%26left_parenthesis%2C%26middle_parenthesis%2C%26right_parenthesis%29%20%21%3D%203%29%20%7B%0A%20%20%20%20%20%20%20%20printf%28%22Nope%5Cn%22%29%3B%0A%20%20%20%20%20%20%20%20return%200%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20if%20%28%28left_parenthesis%2Bmiddle_parenthesis%29%2Bright_parenthesis%20%3D%3D%20left_parenthesis%2B%28middle_parenthesis%2Bright_parenthesis%29%29%0A%20%20%20%20%20%20%20%20printf%28%22Nope%5Cn%22%29%3B%0A%20%20%20%20else%0A%20%20%20%20%20%20%20%20printf%28%22Hooray%5Cn%22%29%3B%0A%7D)

```c
#include <stdio.h>

int main() {
    /* floating-point addition is associative for the finite values accepted here. */
    float left_parenthesis, middle_parenthesis, right_parenthesis;
    if (scanf("%f %f %f", &left_parenthesis,&middle_parenthesis,&right_parenthesis) != 3) {
        printf("Nope\n");
        return 0;
    }

    if ((left_parenthesis+middle_parenthesis)+right_parenthesis == left_parenthesis+(middle_parenthesis+right_parenthesis))
        printf("Nope\n");
    else
        printf("Hooray\n");
}
```

## Time
[![Open in Online Compiler](https://img.shields.io/badge/Open%20in-Online%20Compiler-blue)](https://paiza.io/projects/new?language=c&source_code=%23include%20%3Cstdio.h%3E%0A%23include%20%3Cstdlib.h%3E%0A%23include%20%3Ctime.h%3E%0A%23include%20%3Cstring.h%3E%0A%0Aint%20main%20%28%29%20%7B%0A%20%20%20setenv%28%22TZ%22%2C%20%22Asia%2FJerusalem%22%2C%201%29%3B%0A%20%20%20tzset%28%29%3B%0A%0A%20%20%20int%20calendar_wall%3B%0A%20%20%20int%20month_box%3B%0A%20%20%20int%20day_ticket%3B%0A%20%20%20int%20clock_face%3B%0A%20%20%20int%20minute_fragment%3B%0A%0A%20%20%20scanf%28%22%25d%20%25d%20%25d%20%25d%20%25d%22%2C%26calendar_wall%2C%26month_box%2C%26day_ticket%2C%26clock_face%2C%26minute_fragment%29%3B%0A%0A%20%20%20struct%20tm%20folded_input%20%3D%20%7B0%7D%3B%0A%20%20%20folded_input.tm_year%20%3D%20calendar_wall-1900%3B%0A%20%20%20folded_input.tm_mon%20%3D%20month_box-1%3B%0A%20%20%20folded_input.tm_mday%20%3D%20day_ticket%3B%0A%20%20%20folded_input.tm_hour%20%3D%20clock_face%3B%0A%20%20%20folded_input.tm_min%20%3D%20minute_fragment%3B%0A%0A%0A%20%20%20time_t%20first_shadow%20%3D%20mktime%28%26folded_input%29%3B%20%2F%2Fconvert%20input%20time%20to%20seconds%20since%201.1.1970%20%28unix%20time%29%0A%20%20%20printf%28%22Now%3A%20%25s%22%2C%20asctime%28%26folded_input%29%29%3B%20%2F%2FThis%20is%20the%20time%20of%20input%0A%0A%20%20%20time_t%20second_shadow%20%3D%20first_shadow%2B3600%3B%0A%20%20%20struct%20tm%20%2Afolded_later%20%3D%20localtime%28%26second_shadow%29%3B%0A%20%20%20printf%28%22Later%3A%20%25s%22%2C%20asctime%28folded_later%29%29%3B%20%2F%2FThis%20is%20the%20time%20an%20hour%20from%20input%0A%0A%20%20%20if%28folded_later-%3Etm_hour%20%3E%20folded_input.tm_hour%20%2F%2FThis%20is%20the%20important%20condition%2C%20the%20rest%20are%20to%20prevent%20cheating%0A%20%20%20%7C%7C%20calendar_wall%20%3C%201900%20%7C%7C%20calendar_wall%20%3E%202038%20%7C%7C%20month_box%20%3C%201%20%7C%7C%20month_box%20%3E%2012%20%7C%7C%20day_ticket%20%3C%201%20%7C%7C%20day_ticket%20%3E%2031%20%7C%7C%20clock_face%20%3C%200%20%7C%7C%20clock_face%20%3E%2059%20%7C%7C%20minute_fragment%20%3C%200%20%7C%7C%20minute_fragment%20%3E%2059%29%7B%0A%20%20%20%20printf%28%22Congrats%21%20You%20operate%20in%20a%20linear%20time%20enviroment%5Cn%22%29%3B%0A%20%20%20%7Delse%7B%0A%20%20%20%20printf%28%22Hurray%21%20Time%20Travel%20Detected%5Cn%22%29%3B%0A%20%20%20%7D%0A%0A%20%20%20return%280%29%3B%0A%7D)

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <string.h>

int main () {
   setenv("TZ", "Asia/Jerusalem", 1);
   tzset();

   int calendar_wall;
   int month_box;
   int day_ticket;
   int clock_face;
   int minute_fragment;

   scanf("%d %d %d %d %d",&calendar_wall,&month_box,&day_ticket,&clock_face,&minute_fragment);

   struct tm folded_input = {0};
   folded_input.tm_year = calendar_wall-1900;
   folded_input.tm_mon = month_box-1;
   folded_input.tm_mday = day_ticket;
   folded_input.tm_hour = clock_face;
   folded_input.tm_min = minute_fragment;


   time_t first_shadow = mktime(&folded_input); //convert input time to seconds since 1.1.1970 (unix time)
   printf("Now: %s", asctime(&folded_input)); //This is the time of input

   time_t second_shadow = first_shadow+3600;
   struct tm *folded_later = localtime(&second_shadow);
   printf("Later: %s", asctime(folded_later)); //This is the time an hour from input

   if(folded_later->tm_hour > folded_input.tm_hour //This is the important condition, the rest are to prevent cheating
   || calendar_wall < 1900 || calendar_wall > 2038 || month_box < 1 || month_box > 12 || day_ticket < 1 || day_ticket > 31 || clock_face < 0 || clock_face > 59 || minute_fragment < 0 || minute_fragment > 59){
    printf("Congrats! You operate in a linear time enviroment\n");
   }else{
    printf("Hurray! Time Travel Detected\n");
   }

   return(0);
}
```

