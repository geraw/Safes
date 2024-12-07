#include <stdio.h>

void main() {
    float a,b,c;
    scanf("%f %f %f", &a,&b,&c);
    
    if ((a+b)+c == a+(b+c))
        printf("Nope\n");
    else
        printf("Hooray\n");
}
