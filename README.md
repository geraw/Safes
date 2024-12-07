# Cyber Riddles Challenges

Each of the following programs is a challenge. Your task is to find the input that will make the program print "Hooray". Click the button to open each example in an online compiler.

## Bit Twister

[![Open in Online Compiler](https://img.shields.io/badge/Open%20in-Online%20Compiler-blue)](https://paiza.io/projects/new?language=c&source_code=%23include%20%3Cstdio.h%3E%0A%23include%20%3Climits.h%3E%0A%0Achar%20v%5B256%5D%3B%0A%0Aint%20main%28%29%20%7B%0A%20%20%20%20int%20n%3B%0A%20%20%20%20scanf%28%22%25d%22%2C%20%26n%29%3B%0A%0A%20%20%20%20unsigned%20char%20x%20%3D%201%3B%0A%0A%20%20%20%20for%28int%20i%3D0%3B%20i%3C2%2An%2B1%3B%20i%2B%2B%29%20%7B%0A%20%20%20%20%20%20%20%20v%5Bx%20%5E%20128%5D%3D1%3B%0A%20%20%20%20%20%20%20%20if%28%21%28%28x%20%3C%3C%3D%201%29%20%26%202%29%29%20x%2B%2B%3B%0A%20%20%20%20%20%20%20%20if%28v%5Bx%20%5E%20128%5D%29%20x%20%5E%3D%201%3B%0A%20%20%20%20%20%20%20%20if%28x%20%26%26%20v%5Bx%20%5E%20128%5D%29%20break%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20for%28int%20i%3D0%3B%20i%3Csizeof%28v%29%3B%20i%2B%2B%29%20%7B%0A%20%20%20%20%20%20%20%20if%28%21v%5Bi%5D%20%26%26%20i%20%21%3D%20n%29%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20printf%28%22Nope%5Cn%22%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20return%200%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%0A%20%20%20%20printf%28%22Hooray%5Cn%22%29%3B%0A%20%20%20%20return%201%3B%0A%7D%0A)

```c
#include <stdio.h>
#include <limits.h>

char v[256];

int main() {
    int n;
    scanf("%d", &n);

    unsigned char x = 1;

    for(int i=0; i<2*n+1; i++) {
        v[x ^ 128]=1;
        if(!((x <<= 1) & 2)) x++;
        if(v[x ^ 128]) x ^= 1;
        if(x && v[x ^ 128]) break;
    }

    for(int i=0; i<sizeof(v); i++) {
        if(!v[i] && i != n) {
            printf("Nope\n");
            return 0;
        }
    }

    printf("Hooray\n");
    return 1;
}
```

## Collatz

[![Open in Online Compiler](https://img.shields.io/badge/Open%20in-Online%20Compiler-blue)](https://paiza.io/projects/new?language=c&source_code=%23include%20%3Cstdio.h%3E%0A%0Aint%20Collatz(int%20n)%20%7B%20return%20n%261%3F3*n%2B1%3An%3E%3E1%3B%20%7D%0A%0Aint%20main()%20%7B%0A%20%20%20%20int%20i1%2Ci2%3B%0A%20%20%20%20int%20n%3B%0A%0A%20%20%20%20scanf(%22%25u%22%2C%20%26n)%3B%0A%0A%20%20%20%20for%20(i2%3DCollatz(i1%3Dn)%3B%20i1%5Ei2%3B%20i1%3DCollatz(i1))%20%0A%20%20%20%20%20%20%20%20i2%3DCollatz(Collatz(i2))%3B%0A%0A%20%20%20%20if%20(!n%20%7C%7C%20i1)%0A%20%20%20%20%20%20%20%20printf(%22Nope%5Cn%22)%3B%0A%20%20%20%20else%0A%20%20%20%20%20%20%20%20printf(%22Hooray%5Cn%22)%3B%0A%7D)

```c
#include <stdio.h>

int Collatz(int n) { return n&1?3*n+1:n>>1; }

int main() {
    int i1,i2;
    int n;

    scanf("%u", &n);

    for (i2=Collatz(i1=n); i1^i2; i1=Collatz(i1)) 
        i2=Collatz(Collatz(i2));

    if (!n || i1)
        printf("Nope\n");
    else
        printf("Hooray\n");
}
```

## Floating Point

[![Open in Online Compiler](https://img.shields.io/badge/Open%20in-Online%20Compiler-blue)](https://paiza.io/projects/new?language=c&source_code=%23include%20%3Cstdio.h%3E%0A%0Aint%20main()%20%7B%0A%09int%20n%3B%0A%09scanf(%22%25f%22%2C%20%26n)%3B%0A%09if%20(n!%3D1174188032)%0A%09%09printf(%22Nope%5Cn%22)%3B%0A%09else%0A%09%09printf(%22Hooray%5Cn%22)%3B%0A%7D)

```c
#include <stdio.h>

int main() {
    int n;

    scanf("%f", &n);

    if (n!=1174188032)
        printf("Nope\n");
    else
        printf("Hooray\n");
}
```

## Easy Hex

[![Open in Online Compiler](https://img.shields.io/badge/Open%20in-Online%20Compiler-blue)](https://paiza.io/projects/new?language=c&source_code=%23include%20%3Cstdio.h%3E%0A%0Aint%20main()%20%7B%0A%09int%20n%3B%0A%09scanf(%22%25x%22%2C%20%26n)%3B%0A%09if%20(n%3C%3C8%20%7C%7C%20!(n%3C%3C7))%0A%09%09printf(%22Nope%5Cn%22)%3B%0A%09else%0A%09%09printf(%22Hooray%5Cn%22)%3B%0A%7D)

```c
#include <stdio.h>

int main() {
    int n;

    scanf("%x", &n);

    if (n<<8 || !(n<<7))
        printf("Nope\n");
    else
        printf("Hooray\n");
}
```

## Absurd

[![Open in Online Compiler](https://img.shields.io/badge/Open%20in-Online%20Compiler-blue)](https://paiza.io/projects/new?language=c&source_code=%23include%20%3Cstdio.h%3E%0A%0Aint%20main%28%29%20%7B%0A%09int%20n%3B%0A%09%0A%09scanf%28%22%25d%22%2C%20%26n%29%3B%0A%09sprintf%28%26n%2C%22%25d%22%2Cabs%28n%3C%3C1%29%29%3B%0A%0A%09if%20%28n%20%3E0%20%26%26%20%28%28char%20%2A%29%26n%29%5B0%5D%20%21%3D%20%27-%27%29%0A%09%09printf%28%22Nope%5Cn%22%29%3B%0A%09else%0A%09%09printf%28%22Hooray%5Cn%22%29%3B%0A%7D)

```c
#include <stdio.h>

int main() {
	int n;
	
	scanf("%d", &n);
	sprintf(&n,"%d",abs(n<<1));

	if (n >0 && ((char *)&n)[0] != '-')
		printf("Nope\n");
	else
		printf("Hooray\n");
}
```

## I Am A Riddle

[![Open in Online Compiler](https://img.shields.io/badge/Open%20in-Online%20Compiler-blue)](https://paiza.io/projects/new?language=c&source_code=%23include%20%3Cstdio.h%3E%0A%0Aint%20main()%20%7B%0A%09int%20n%3B%0A%09char%20*c%3D%22I'm%20a%20Riddle%22%3B%0A%09int%20*p%3D(int*)c%3B%0A%09scanf(%22%25d%22%2C%20%26n)%3B%0A%09if%20(p%5B0%5D%2B(p%5B1%5D%2Bp%5B2%5D*n)*n)%0A%09%09printf(%22Nope%5Cn%22)%3B%0A%09else%0A%09%09printf(%22Hooray%5Cn%22)%3B%0A%7D)

```c
#include <stdio.h>

int main() {
    int n;
    char *c="I'm a Riddle";
    int *p=(int*)c;

    scanf("%d", &n);

    if (p[0]+(p[1]+p[2]*n)*n)
        printf("Nope\n");
    else
        printf("Hooray\n");
}
```

## BGU

[![Open in Online Compiler](https://img.shields.io/badge/Open%20in-Online%20Compiler-blue)](https://paiza.io/projects/new?language=c&source_code=%23include%20%3Cstdio.h%3E%0A%23include%20%3Cstring.h%3E%0A%0Aint%20main()%20%7B%0A%09int%20n%3B%0A%09scanf(%22%25d%22%2C%20%26n)%3B%0A%09if%20(strcmp((char%20*)&n%2C%22BGU%22))%0A%09%09printf(%22Nope%5Cn%22)%3B%0A%09else%0A%09%09printf(%22Hooray%5Cn%22)%3B%0A%7D)

```c
#include <stdio.h>
#include <string.h>

int main() {
    int n;    

    scanf("%d",&n);

    if (strcmp((char *)&n,"BGU"))
        printf("Nope\n");
    else
        printf("Hooray\n");
}
```

## Floating Point Comparison

[![Open in Online Compiler](https://img.shields.io/badge/Open%20in-Online%20Compiler-blue)](https://paiza.io/projects/new?language=c&source_code=%23include%20%3Cstdio.h%3E%0A%0Aint%20main()%20%7B%0A%09float%20x%3D1%3B%0A%09int%20n%3B%0A%09scanf(%22%25d%22%2C%20%26n)%3B%0A%09if%20(n%2Bx%20%3E%20n)%0A%09%09printf(%22Nope%5Cn%22)%3B%0A%09else%0A%09%09printf(%22Hooray%5Cn%22)%3B%0A%7D)

```c
#include <stdio.h>

int main() {
    float x=1;
    int n;

    scanf("%d",&n);

    if (n+x > n)
        printf("Nope\n");
    else
        printf("Hooray\n");
}
```

## Tricky Hex

[![Open in Online Compiler](https://img.shields.io/badge/Open%20in-Online%20Compiler-blue)](https://paiza.io/projects/new?language=c&source_code=%23include%20%3Cstdio.h%3E%0A%0Aint%20main()%20%7B%0A%09int%20t%2Ch%2Ci%2Cn%2Ck%5B8%5D%3D%7B0%2C32%2C72%2C101%2C111%2C114%2C121%2C127%7D%3B%0A%09char%20s%5B8%5D%3B%0A%09scanf(%22%25d%22%2C%20%26n)%3B%0A%09for%20(t%3D1%2B(h%3Di%3D0)%3B%20i%3C31%3B%20i%2B%2Bt*%3D3)%0A%09%09h%2B%3D((n%3E%3Ei)%261)*t%3B%0A%09printf(%22n%3D%25d%20h%3D%25d%5Cn%22%2Cn%2Ch)%3B%0A%09if%20(h%3D%3D561936774)%20%7B%0A%09%09for%20(i%3D0%3B%20i%3C7%3B%20i%2B%2B%2Cn%3E%3E%3D3)%0A%09%09%09s%5Bi%5D%3Dk%5Bn%26%7B%0A%09%09printf(%22%257s%5Cn%22%2Cs)%3B%0A%09%7D%0A%09else%0A%09%09printf(%22Nope%5Cn%22)%3B%0A%7D)

```c
#include <stdio.h>

int main() {
    int t,h,i,n,k[8]={0,32,72,101,111,114,121,127};
    char s[8];

    scanf("%d",&n);

    for (t=1+(h=i=0); i<31; i++,t*=3)
        h+=((n>>i)&1)*t;
    printf("n=%d h=%d\n",n,h);
    if (h==561936774) {
        for (i=0; i<7; i++,n>>=3)
            s[i]=k[n&7];
        printf("%7s\n",s);
        }
    else
        printf("Nope\n");
}
```

## Matthew 18:15

[![Open in Online Compiler](https://img.shields.io/badge/Open%20in-Online%20Compiler-blue)](https://paiza.io/projects/new?language=c&source_code=%23include%20%3Cstdio.h%3E%0A%23include%20%3Cstring.h%3E%0A%0A%23define%20Matthew_18_15%20%22If%20your%20brother%20or%20sister%20sins%2C%20go%20and%20point%20out%20their%20fault%2C%20just%20between%20the%20two%20of%20you.%20If%20they%20listen%20to%20you%2C%20you%20have%20won%20them%20over.%22%0A%0Aint%20main()%20%7B%0A%20%20%20%20char%20str1%5B%5D%20%3D%20Matthew_18_15%3B%20%0A%20%20%20%20char%20str2%5B%5D%20%3D%20Matthew_18_15%3B%0A%0A%20%20%20%20int%20n%3B%0A%0A%20%20%20%20scanf(%22%25d%22%2C%20%26n)%3B%0A%0A%20%20%20%20if(%20n%20%3E-%200%20%26%26%20n%20%3C%20sizeof(str1)%20)%20%0A%20%20%20%20%20%20%20%20str1%5Bn%5D%3Dstr2%5Bn%5D%3D'*'%3B%0A%0A%20%20%20%20if%20(strcmp(str1%2Cstr2)%20%3D%3D%200)%0A%20%20%20%20%20%20%20%20printf(%22Nope%5Cn%22)%3B%0A%20%20%20%20else%0A%20%20%20%20%20%20%20%20printf(%22Hooray%5Cn%22)%3B%0A%7D)

```c
#include <stdio.h>
#include <string.h>

#define Matthew_18_15 "If your brother or sister sins, go and point out their fault, just between the two of you. If they listen to you, you have won them over."

int main() {
    char str1[] = Matthew_18_15; 
    char str2[] = Matthew_18_15;

    int n;

    scanf("%d", &n);

    if( n >- 0 && n < sizeof(str1) ) 
         str1[n]=str2[n]='*';

    if (strcmp(str1,str2) == 0)
        printf("Nope\n");
    else
        printf("Hooray\n");
}
```

## Buffer Overflow Exploit

[![Open in Online Compiler](https://img.shields.io/badge/Open%20in-Online%20Compiler-blue)](https://paiza.io/projects/new?language=c&source_code=%23include%20%3Cstdio.h%3E%0A%23include%20%3Cstdlib.h%3E%0A%23include%20%3Cstring.h%3E%0A%0A%0Achar%20hooray%5B%5D%20%3D%20%22Hooray%22%3B%0Achar%20nope%5B%5D%20%20%20%3D%20%22Nope%22%3B%0A%0Aint%20main%28%29%20%7B%0A%20%20%20%20gets%28hooray%29%3B%20%0A%20%20%20%20hooray%5Bstrlen%28hooray%29%2F2%5D%20%2F%3D%202%3B%0A%20%20%20%20hooray%5Bsizeof%28hooray%29-1%5D%20-%3D%2032%3B%0A%20%20%20%20%0A%20%20%20%20if%28%21strcmp%28hooray%2Cnope%29%29%0A%20%20%20%20%20%20%20%20printf%28%22%25s%5Cn%22%2C%20nope%29%3B%0A%20%20%20%20else%0A%20%20%20%20%20%20%20%20printf%28%22Nope%5Cn%22%29%3B%0A%7D)

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>


char hooray[] = "Hooray";
char nope[]   = "Nope";

int main() {
    gets(hooray); 
    hooray[strlen(hooray)/2] /= 2;
    hooray[sizeof(hooray)-1] -= 32;
    
    if(!strcmp(hooray,nope))
        printf("%s\n", nope);
    else
        printf("Nope\n");
}
```

## Inequality

[![Open in Online Compiler](https://img.shields.io/badge/Open%20in-Online%20Compiler-blue)](https://paiza.io/projects/new?language=c&source_code=%23include%20%3Cstdio.h%3E%0A%23include%20%3Cmath.h%3E%0A%0Aint%20main()%20%7B%0A%20%20%20%20float%20a%3B%0A%0A%20%20%20%20scanf(%22%25f%22%2C%20%26a)%3B%0A%0A%20%20%20%20if%20(2%20*%20a%20!%3D%20a%20%2B%20a)%20%7B%0A%20%20%20%20%20%20%20%20printf(%22Hooray%5Cn%22)%3B%0A%20%20%20%20%7D%20else%20%20%7B%0A%20%20%20%20%20%20%20%20printf(%22Nope%5Cn%22)%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20return%200%3B%0A%7D)

```c
#include <stdio.h>
#include <math.h>

int main() {
    float a;

    scanf("%f", &a);

    if (2 * a != a + a) {
        printf("Hooray\n");
    } else {
        printf("Nope\n");
    }

    return 0;
}
```

## Absolute Value

[![Open in Online Compiler](https://img.shields.io/badge/Open%20in-Online%20Compiler-blue)](https://paiza.io/projects/new?language=c&source_code=%23include%20%3Cstdio.h%3E%0A%0Aint%20a(int%20x)%20%7B%0A%20%20%20%20if%20(x%20%3C%200)%20return%20-x%3B%0A%20%20%20%20return%20x%3B%0A%7D%0A%0Avoid%20main()%20%7B%0A%20%20%20%20int%20n%3B%0A%0A%20%20%20%20scanf(%22%25d%22%2C%20%26n)%3B%0A%0A%20%20%20%20if%20(a(n)%20%3E%3D%200)%0A%20%20%20%20%20%20%20%20printf(%22Nope%5Cn%22)%3B%0A%20%20%20%20else%0A%20%20%20%20%20%20%20%20printf(%22Hooray%5Cn%22)%3B%0A%0A%7D)

```c
#include <stdio.h>

int a(int x) {
    if (x < 0) return -x;
    return x;
}

void main() {
    int n;

    scanf("%d", &n);

    if (a(n) >= 0)
        printf("Nope\n");
    else
        printf("Hooray\n");
}
```

