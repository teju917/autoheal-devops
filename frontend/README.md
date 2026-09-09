# Frontend (React + Vite)

This frontend is a Vite + React app built to be served by nginx in production. The repository includes a Dockerfile and is wired into the top-level `docker-compose.yml` for local integration with the backend.

**Quick overview**
- **Dev:** Vite dev server with HMR on port 5173 (default).
- **Prod:** Static build output served from nginx on port 80 inside the container.

## Prerequisites
- Node.js 18+ and npm installed for local development.
- Docker and docker-compose for container builds and local integration.
- (For Kubernetes) a container registry (Docker Hub, GHCR, ECR, etc.) and kubectl configured for your cluster.

## Environment
- The app expects any runtime env vars to be provided by the backend or by the hosting environment. When using `docker-compose`, the top-level `docker-compose.yml` sets service ports and the backend receives `MONGO_URI` from the environment.

## Local development
Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open http://localhost:5173 to view the app during development.

## Build (production)
Create an optimized production build:

```bash
npm run build
```

The build output will be in the `dist/` directory and is ready to be served by the nginx image defined in the `Dockerfile`.

## Docker
Build and run the production image locally:

```bash
# from frontend/
docker build -t <your-registry>/autoheal-frontend:latest .
docker run --rm -p 8080:80 <your-registry>/autoheal-frontend:latest
```

Notes:
- Replace `<your-registry>` with your Docker Hub/registry path or use a local tag for testing.
- The image serves the `dist/` content on container port 80.

## Docker Compose
The repository includes a top-level `docker-compose.yml` that builds `backend` and `frontend` and wires them together. To start both services locally:

```bash
# from repository root
docker compose up --build
```

The backend is exposed on host port 5000 and the frontend on host port 3000 (proxied to nginx:80 in the container).

## Kubernetes (how to deploy)
This project does not include official k8s manifests yet. Below are minimal steps and example manifests you can adapt.

1) Build and push images to a registry you control:

```bash
docker build -t <your-registry>/autoheal-frontend:TAG ./frontend
docker push <your-registry>/autoheal-frontend:TAG
```

2) Create a Kubernetes Deployment and Service (example YAML):

Create a new folder `k8s/` and add `frontend-deployment.yaml` with contents similar to:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
	name: autoheal-frontend
spec:
	replicas: 2
	selector:
		matchLabels:
			app: autoheal-frontend
	template:
		metadata:
			labels:
				app: autoheal-frontend
		spec:
			containers:
				- name: frontend
					image: <your-registry>/autoheal-frontend:TAG
					ports:
						- containerPort: 80

---

apiVersion: v1
kind: Service
metadata:
	name: autoheal-frontend
spec:
	selector:
		app: autoheal-frontend
	ports:
		- protocol: TCP
			port: 80
			targetPort: 80
	type: ClusterIP
```

3) (Optional) Expose via an Ingress or LoadBalancer depending on your cluster. Example ingress snippet:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
	name: autoheal-frontend-ingress
spec:
	rules:
		- host: frontend.example.com
			http:
				paths:
					- path: /
						pathType: Prefix
						backend:
							service:
								name: autoheal-frontend
								port:
									number: 80
```

4) Apply manifests:

```bash
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-ingress.yaml  # if you created an ingress file
```

Notes and tips:
- Ensure the backend is reachable from the frontend (same cluster or via service URL). If the backend provides API URLs via env vars, configure them in the Deployment (`env:` section).
- For secrets (like `MONGO_URI`), use `Secret` objects in Kubernetes and mount them or inject as env vars.
- Use image tags and CI to promote images (avoid using `:latest` in production).

## Further help
If you want, I can:
- Add sample `k8s/` manifests into the repo.
- Add a `k8s/README.md` with cluster-specific steps.
- Wire CI to build and push images automatically.

Tell me which of the above you want me to do next.
