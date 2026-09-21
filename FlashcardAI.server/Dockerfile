FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 10000

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["FlashcardAI.server.csproj", "./"]
RUN dotnet restore "FlashcardAI.server.csproj"

COPY . .
RUN dotnet publish "FlashcardAI.server.csproj" \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false

FROM base AS final
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:10000

ENTRYPOINT ["dotnet", "FlashcardAI.server.dll"]