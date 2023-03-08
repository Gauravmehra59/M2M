n=int(input("enter the no:"))
v1=0
v2=1
sum=0
print(v1)

print(v2)
for i in range(0,n-2):
    sum=v1+v2
    v1=v2
    v2=sum
    print(sum)
    sum=0
