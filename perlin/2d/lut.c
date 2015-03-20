#include <stdio.h>
#include <stdlib.h>

void swap(int *a, int *b)
{
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main(int argc, char *argv[])
{
    int perm[256];
    int i, j, k;

    for (i = 0; i < 256; ++i)
    {
        perm[i] = i;
    }

    for (i = 0; i < 256; ++i)
    {
        j = rand() % 256;
        k = rand() % 256;
        swap(&perm[j], &perm[k]);
    }

    printf("%d", perm[0]);
    for (i = 1; i < 256; ++i)
    {
        printf(", %d", perm[i]);
    }

    return 0;
}