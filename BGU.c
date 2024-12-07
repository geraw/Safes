#include <stdio.h>
#include <string.h>

void main() {

    int  n;	

	scanf("%d",&n);

	if (strcmp((char *)&n,"BGU"))
		printf("Nope\n");
	else
		printf("Hooray\n");

}
