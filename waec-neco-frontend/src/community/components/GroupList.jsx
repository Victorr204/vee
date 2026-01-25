import { colors } from "../ui/color";
import { Card, Button } from "../ui/components";
import { typography } from "../ui/typography";

/*
  GROUP LIST SIDEBAR (Firebase-ready)
  - Static, safe study groups
  - No backend dependency
  - Predictable routing
*/

const GROUPS = [
  { id: "general", name: "General" },
  { id: "mathematics", name: "Mathematics" },
  { id: "english", name: "English" },
  { id: "biology", name: "Biology" },
  { id: "chemistry", name: "Chemistry" },
  { id: "physics", name: "Physics" },
];

export default function GroupList({ active, onSelect }) {
  return (
    <Card
      className="sidebar"
      style={{
        padding: 16,
        display: "flex",
        flexDirection: "column",
        minWidth: 220,
      }}
    >
      <h3
        style={{
          color: colors.textLight,
          ...typography.h4,
          marginBottom: 12,
        }}
      >
        Study Groups
      </h3>

      {GROUPS.map((group) => (
        <Button
          key={group.id}
          variant={active === group.id ? "primary" : "secondary"}
          onClick={() => onSelect(group.id)}
          fullWidth
          aria-label={`Join ${group.name} group`}
          style={{
            textAlign: "left",
            marginBottom: 6,
            ...typography.button,
          }}
        >
          #{group.name}
        </Button>
      ))}

      <Button
        variant="disabled"
        fullWidth
        style={{
          marginTop: 12,
          opacity: 0.6,
          cursor: "not-allowed",
        }}
      >
        + Create Group (Coming Soon)
      </Button>
    </Card>
  );
}
