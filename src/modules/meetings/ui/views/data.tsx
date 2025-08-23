import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DataView({ data }: any) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        Items ({data.total}) • Pages: {data.totalPages}
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {data.items.map((item: any) => (
          <Card key={item.id} className="shadow-sm border rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {item.name}
                <Badge
                  variant={
                    item.status === "active"
                      ? "default"
                      : item.status === "completed"
                      ? "secondary"
                      : item.status === "cancelled"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {item.status}
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="text-sm space-y-1">
              <p>
                <span className="font-medium">User:</span> {item.userId}
              </p>
              <p>
                <span className="font-medium">Agent:</span> {item.agentId}
              </p>
              <p>
                <span className="font-medium">Created:</span>{" "}
                {new Date(item.createdAt).toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Updated:</span>{" "}
                {new Date(item.updatedAt).toLocaleString()}
              </p>
              {item.startedAt && (
                <p>
                  <span className="font-medium">Started:</span>{" "}
                  {new Date(item.startedAt).toLocaleString()}
                </p>
              )}
              {item.endedAt && (
                <p>
                  <span className="font-medium">Ended:</span>{" "}
                  {new Date(item.endedAt).toLocaleString()}
                </p>
              )}
              {item.transcriptURL && (
                <p>
                  <span className="font-medium">Transcript:</span>{" "}
                  <a
                    href={item.transcriptURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View
                  </a>
                </p>
              )}
              {item.recordingURL && (
                <p>
                  <span className="font-medium">Recording:</span>{" "}
                  <a
                    href={item.recordingURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Listen
                  </a>
                </p>
              )}
              {item.summary && (
                <p>
                  <span className="font-medium">Summary:</span> {item.summary}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
