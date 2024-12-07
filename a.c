#include <stdio.h>

int a(int x) {
    if (x<0) return -x;
    return x;
}

void main() {
	int n;

	scanf("%d",&n);

	if (a(n)>=0)
		printf("Nope\n");
	else
		printf("Hooray\n");

}
