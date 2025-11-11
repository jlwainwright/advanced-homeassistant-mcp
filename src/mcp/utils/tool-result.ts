/**
 * Tool Result Utilities
 * 
 * Converts tool execution results to MCP-compliant format.
 * MCP spec requires tool results to be in format:
 * {
 *   content: [{ type: "text", text: string }],
 *   isError?: boolean
 * }
 */

/**
 * Convert a tool execution result to MCP-compliant format
 * 
 * @param result - Tool execution result (can be any type)
 * @param isError - Whether this is an error result
 * @returns MCP-compliant tool result
 */
export function formatToolResult(result: any, isError: boolean = false): {
  content: Array<{ type: string; text: string }>;
  isError: boolean;
} {
  // If result is already in MCP format, return as-is (but ensure isError is set)
  if (result && typeof result === 'object' && 'content' in result && Array.isArray(result.content)) {
    return {
      content: result.content,
      isError: result.isError ?? isError
    };
  }

  // Convert various result formats to MCP format
  let textContent: string;

  if (result === null || result === undefined) {
    textContent = '';
  } else if (typeof result === 'string') {
    textContent = result;
  } else if (typeof result === 'number' || typeof result === 'boolean') {
    textContent = String(result);
  } else if (result instanceof Error) {
    textContent = result.message;
    isError = true;
  } else if (typeof result === 'object') {
    // Handle objects with success/message pattern (common in our tools)
    if ('success' in result && 'message' in result) {
      textContent = result.message || (result.success ? 'Operation completed successfully' : 'Operation failed');
      isError = !result.success;
    } else if ('error' in result) {
      textContent = typeof result.error === 'string' ? result.error : JSON.stringify(result.error);
      isError = true;
    } else {
      // Convert object to JSON string
      try {
        textContent = JSON.stringify(result, null, 2);
      } catch (e) {
        textContent = String(result);
      }
    }
  } else {
    textContent = String(result);
  }

  return {
    content: [
      {
        type: 'text',
        text: textContent
      }
    ],
    isError
  };
}

/**
 * Check if a result indicates an error
 */
export function isErrorResult(result: any): boolean {
  if (!result || typeof result !== 'object') {
    return false;
  }

  // Check for explicit error flags
  if ('isError' in result && result.isError === true) {
    return true;
  }

  if ('success' in result && result.success === false) {
    return true;
  }

  if ('error' in result) {
    return true;
  }

  if (result instanceof Error) {
    return true;
  }

  return false;
}

